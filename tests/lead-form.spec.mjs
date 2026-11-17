import { test, expect } from "@playwright/test";

const endpoint = "https://macho-notify.olalekanayomide475.workers.dev/notify";
const storeKey = "macho_prospect";

async function mockServices(page, failSubmission) {
  const events = [];
  let failedOnce = false;
  await page.route(endpoint, async route => {
    const data = route.request().postDataJSON();
    events.push(data);
    if (data.event === "details_submitted" && failSubmission && !failedOnce) {
      failedOnce = true;
      await route.fulfill({
        status: failSubmission === "http" ? 503 : 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: false }),
      });
      return;
    }
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      headers: { "access-control-allow-origin": "*" },
      body: JSON.stringify({ ok: true }),
    });
  });
  // Never contact the real Worker, Telegram bot or WhatsApp in these tests.
  await page.route("https://wa.me/**", route => route.fulfill({
    status: 200,
    contentType: "text/html",
    body: "<title>Mock WhatsApp handoff</title>",
  }));
  return events;
}

async function openForm(page) {
  await page.getByRole("button", { name: "Get the full details", exact: true }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
}

async function fillDetails(page, student = "No") {
  await page.getByLabel("Full name", { exact: true }).fill("Form Test Prospect");
  await page.getByLabel("WhatsApp number", { exact: true }).fill("08012345678");
  await page.getByLabel("State / FCT", { exact: true }).selectOption("Ondo");
  await page.getByLabel("LGA / area council", { exact: true }).selectOption("Akure South");
  await page.getByLabel("Exact location / nearest landmark", { exact: true }).fill("FUTA Southgate test landmark");
  if (student) await page.getByRole("radio", { name: student, exact: true }).check();
}

test("waits for an explicit request, even after five seconds and scrolling", async ({ page }) => {
  const events = await mockServices(page);
  await page.goto("/");
  await page.waitForTimeout(5500);
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.locator("#interest").scrollIntoViewIfNeeded();
  await page.waitForTimeout(250);
  await expect(page.getByRole("dialog")).toHaveCount(0);
  expect(events.filter(event => event.event === "details_popup_shown")).toHaveLength(0);
  await openForm(page);
  await expect(page.getByRole("button", { name: "Continue to WhatsApp", exact: true })).toBeDisabled();
  await page.getByRole("button", { name: "Keep reading for now", exact: true }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
});

test("bundles all 36 states, FCT and 774 LGAs and resets LGA when the state changes", async ({ page }) => {
  await mockServices(page);
  await page.goto("/");
  await openForm(page);
  const state = page.getByLabel("State / FCT", { exact: true });
  const lga = page.getByLabel("LGA / area council", { exact: true });
  await expect(lga).toBeDisabled();
  const states = await state.locator("option").evaluateAll(options => options.map(option => option.value).filter(Boolean));
  expect(states).toHaveLength(37);
  expect(new Set(states).size).toBe(37);
  let total = 0;
  for (const name of states) {
    await state.selectOption(name);
    const names = await lga.locator("option").evaluateAll(options => options.map(option => option.value).filter(Boolean));
    expect(names.length).toBeGreaterThan(0);
    expect(new Set(names).size).toBe(names.length);
    total += names.length;
  }
  expect(total).toBe(774);
  await state.selectOption("Ondo");
  await expect(lga.locator("option")).toHaveCount(19);
  await lga.selectOption("Akure South");
  await state.selectOption("Lagos");
  await expect(lga).toHaveValue("");
  await expect(lga.locator("option")).toHaveCount(21);
  await expect(lga.locator('option[value="Akure South"]')).toHaveCount(0);
  await state.selectOption("Federal Capital Territory");
  await expect(lga.locator("option")).toHaveCount(7);
  await expect(lga.locator('option[value="Abuja Municipal"]')).toHaveCount(1);
});

for (const student of ["Yes", "No"]) {
  test("requires student status and submits " + student + " with a complete location", async ({ page }) => {
    const events = await mockServices(page);
    await page.goto("/");
    await openForm(page);
    await fillDetails(page, "");
    const submit = page.getByRole("button", { name: "Continue to WhatsApp", exact: true });
    await expect(submit).toBeDisabled();
    await page.getByRole("radio", { name: student, exact: true }).check();
    await expect(submit).toBeEnabled();
    await submit.click();
    await expect(page).toHaveURL(/^https:\/\/wa\.me\/2349160956794\?/);
    const message = new URL(page.url()).searchParams.get("text");
    expect(message).toContain("State: Ondo");
    expect(message).toContain("LGA / area council: Akure South");
    expect(message).toContain("Exact location: FUTA Southgate test landmark");
    expect(message).toContain("Student: " + student);
    const submissions = events.filter(event => event.event === "details_submitted");
    expect(submissions).toHaveLength(1);
    expect(submissions[0].details).toMatchObject({
      state: "Ondo",
      lga: "Akure South",
      exactLocation: "FUTA Southgate test landmark",
      isStudent: student === "Yes",
      role: student === "Yes" ? "Student" : "Not a student",
      location: "FUTA Southgate test landmark, Akure South, Ondo",
    });
    await page.goto("/");
    const saved = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), storeKey);
    expect(saved.detailsSubmitted).toBe(true);
    expect(saved.details.isStudent).toBe(student === "Yes");
  });
}

for (const failure of ["http", "body"]) {
  test("retains the form and supports retry after a " + failure + " submission failure", async ({ page }) => {
    const events = await mockServices(page, failure);
    await page.goto("/");
    await openForm(page);
    await fillDetails(page);
    await page.getByRole("button", { name: "Continue to WhatsApp", exact: true }).click();
    await expect(page.getByRole("alert")).toContainText("couldn't save your details");
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByLabel("Exact location / nearest landmark", { exact: true })).toHaveValue("FUTA Southgate test landmark");
    const saved = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), storeKey);
    expect(saved.detailsSubmitted).toBe(false);
    await page.getByRole("button", { name: "Continue to WhatsApp", exact: true }).click();
    await expect(page).toHaveURL(/^https:\/\/wa\.me\/2349160956794\?/);
    expect(events.filter(event => event.event === "details_submitted")).toHaveLength(2);
  });
}

test("preserves locked answers and the mandatory form in the existing gateway", async ({ page }) => {
  await mockServices(page);
  await page.goto("/");
  await page.getByRole("button", { name: "Yes, I've heard of it but I didn't join", exact: true }).click();
  await page.reload();
  await expect(page.getByText("You selected:", { exact: false })).toContainText("I've heard of it before");
  await expect(page.getByRole("button", { name: "No, I've never heard of it", exact: true })).toHaveCount(0);
  await page.locator("#interest").getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByRole("button", { name: "Yes, let's talk on WhatsApp", exact: true }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByRole("button", { name: "Close details form", exact: true })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Keep reading for now", exact: true })).toHaveCount(0);
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeVisible();
  const saved = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), storeKey);
  expect(saved.choiceLocked).toBe("heard-before");
});

test("preserves the rejection block across reloads", async ({ page }) => {
  await mockServices(page);
  await page.goto("/");
  await page.getByRole("button", { name: "No, I've never heard of it", exact: true }).click();
  await page.getByRole("button", { name: "No, I'm not interested", exact: true }).click();
  await expect(page.getByRole("heading", { name: "No problem at all.", exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByRole("heading", { name: "No problem at all.", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Get the full details", exact: true })).toHaveCount(0);
  const saved = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), storeKey);
  expect(saved.banned).toBe(true);
  expect(saved.choiceLocked).toBe("never-heard");
});
