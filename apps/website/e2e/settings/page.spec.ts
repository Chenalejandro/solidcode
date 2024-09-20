import { env } from "@/env";
import { test, expect } from "@playwright/test";

test("change the display name", async ({ page }) => {
  await page.goto("http://localhost:3000/es/signin");
  await page.getByText("Correo electrónico").waitFor();
  await page.getByLabel("Correo electrónico").fill(env.AUTH_EMAIL);
  await page
    .getByLabel("Contraseña", { exact: true })
    .fill(env.AUTH_EMAIL_PASSWORD);
  await page.getByRole("button", { name: "Iniciar sesión", exact: true }).click();
  await page.waitForURL("http://localhost:3000/es", { timeout: 3000 });
  await page.goto("http://localhost:3000/settings");

  await page.getByLabel("Usuario").fill("newName");
  await page.getByRole("button", { name: "Guardar", exact: true }).click();
  await expect(
    page.getByRole("status").filter({ hasNotText: "Notification" }),
  ).toHaveText("Profile updated.");
});
