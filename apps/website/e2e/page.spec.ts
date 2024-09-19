import { env } from "@/env";
import { test, expect } from "@playwright/test";

test("has title", async ({ page }) => {
  await page.goto("http://localhost:5000");

  await expect(page).toHaveTitle(/Solid Code/);
});

test("navigate from root page to the first problem's page", async ({
  page,
}) => {
  await page.goto("http://localhost:5000/es");

  await page.getByText("Revertir el arreglo").click();
  await expect(page).toHaveURL(
    "http://localhost:5000/es/problems/reverse-the-array",
  );
});

test("can log in", async ({ page }) => {
  await page.goto("http://localhost:5000/es/signin");
  await page.getByText("Correo electrónico").waitFor();
  await page.getByLabel("Correo electrónico").fill(env.AUTH_EMAIL);
  await page
    .getByLabel("Contraseña", { exact: true })
    .fill(env.AUTH_EMAIL_PASSWORD);
  await page.getByRole("button", { name: "Iniciar sesión", exact: true }).click();
  await page.waitForURL("http://localhost:5000/es", { timeout: 3000 });
});
