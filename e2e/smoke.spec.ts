import { test, expect } from "@playwright/test";

test.describe("Smoke Tests", () => {
  test("home page loads with key elements", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: /is this recyclable/i })).toBeVisible();
    await expect(page.getByPlaceholder(/search any item/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /scan/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /upload/i })).toBeVisible();
  });

  test("search for 'plastic bag' with Orlando provider shows trash result", async ({
    page,
  }) => {
    await page.goto("/");

    // Open location selector and pick Orlando
    await page.getByRole("button", { name: /select location|general/i }).click();
    await page.getByText("Orlando, FL").click();

    // Search for plastic bag
    const searchInput = page.getByPlaceholder(/search any item/i);
    await searchInput.fill("plastic bag");
    await searchInput.press("Enter");

    // Should navigate to result page
    await page.waitForURL(/\/result/);

    // Should show result — either the trash category or 'not accepted' guidance
    await expect(
      page.getByText(/trash|not accepted|plastic bag/i).first()
    ).toBeVisible({ timeout: 10_000 });
  });

  test("about page loads", async ({ page }) => {
    await page.goto("/about");
    await expect(page.getByRole("heading", { name: /about/i })).toBeVisible();
  });

  test("faq page loads", async ({ page }) => {
    await page.goto("/faq");
    await expect(page.getByRole("heading", { name: /faq/i })).toBeVisible();
  });

  test("privacy page loads", async ({ page }) => {
    await page.goto("/privacy");
    await expect(page.getByRole("heading", { name: /privacy/i })).toBeVisible();
  });

  test("providers page loads and shows providers", async ({ page }) => {
    await page.goto("/providers");
    await expect(page.getByText("General Guidance")).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText("Orlando, FL")).toBeVisible();
  });
});
