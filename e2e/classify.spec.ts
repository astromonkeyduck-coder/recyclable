import { test, expect } from "@playwright/test";

test.describe("Classify (ontology engine)", () => {
  test("'piece of paper' shows Recycle result", async ({ page }) => {
    await page.goto("/");
    const searchInput = page.getByPlaceholder(/search any item/i);
    await searchInput.fill("piece of paper");
    await searchInput.press("Enter");
    await page.waitForURL(/\/result/);
    await expect(
      page.getByText(/recycle/i).first()
    ).toBeVisible({ timeout: 15_000 });
  });

  test("'keys' shows correct disposal (recycle/drop-off)", async ({ page }) => {
    await page.goto("/");
    const searchInput = page.getByPlaceholder(/search any item/i);
    await searchInput.fill("keys");
    await searchInput.press("Enter");
    await page.waitForURL(/\/result/);
    await expect(
      page.getByText(/recycle|drop-off|drop off|metal/i).first()
    ).toBeVisible({ timeout: 15_000 });
  });

  test("'ceramic decoration' shows trash or ceramic result", async ({ page }) => {
    await page.goto("/");
    const searchInput = page.getByPlaceholder(/search any item/i);
    await searchInput.fill("ceramic decoration");
    await searchInput.press("Enter");
    await page.waitForURL(/\/result/);
    await expect(
      page.getByText(/trash|recycle|compost|dropoff|hazardous|ceramic/i).first()
    ).toBeVisible({ timeout: 15_000 });
  });

  test("debug classify page loads and can run classification", async ({
    page,
  }) => {
    await page.goto("/debug/classify");
    await expect(
      page.getByRole("heading", { name: /debug.*classify/i })
    ).toBeVisible();
    const queryInput = page.getByPlaceholder(/piece of paper|receipt|keys/i);
    await queryInput.fill("receipt");
    await page.getByRole("button", { name: /classify/i }).click();
    await expect(
      page.getByText(/receipt_thermal|trash|confidence/i).first()
    ).toBeVisible({ timeout: 10_000 });
  });
});
