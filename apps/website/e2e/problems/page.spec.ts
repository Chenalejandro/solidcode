import { env } from "@/env";
import { test, expect } from "@playwright/test";

test("Submission code must be longer or equal than 20 characters", async ({
  page,
}) => {
  await page.goto("http://localhost:3000/problems/reverse-the-array");
  const monacoEditor = page.locator(".monaco-editor").nth(0);
  await monacoEditor.click();
  await page.keyboard.press("ControlOrMeta+KeyA");
  await page.keyboard.type("TextLessThan20Char");
  await expect(page.getByRole("button", { name: "Ejecutar" })).toBeDisabled();
  await expect(
    page.getByRole("alert").filter({ hasText: "El código debe" }),
  ).toHaveText("El código debe tener entre 20 y 10000 caracteres");
});

test("Submission code must be less or equal than 10000 characters", async ({
  page,
}) => {
  await page.goto("http://localhost:3000/problems/reverse-the-array");
  const monacoEditor = page.locator(".monaco-editor").nth(0);
  await monacoEditor.click();
  await page.keyboard.press("ControlOrMeta+KeyA");
  await page.keyboard.insertText(`
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
    TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
TextLongerThan1000Characters
    `);
  await expect(page.getByRole("button", { name: "Ejecutar" })).toBeDisabled();
  await expect(
    page.getByRole("alert").filter({ hasText: "El código debe" }),
  ).toHaveText("El código debe tener entre 20 y 10000 caracteres");
});

test("Must be authenticated before submitting the code", async ({ page }) => {
  await page.goto("http://localhost:3000/problems/reverse-the-array");
  await page.getByRole("button", { name: "Ejecutar" }).click();
  await expect(page.getByRole("heading", { level: 2 })).toHaveText(
    "Inicia la sesión para continuar",
  );
});

test("Given a code that respect precondition and postcondition then the submission is correct", async ({
  page,
}) => {
  await page.goto("http://localhost:3000/es/signin");
  await page.getByText("Correo electrónico").waitFor();
  await page.getByLabel("Correo electrónico").fill(env.AUTH_EMAIL);
  await page
    .getByLabel("Contraseña", { exact: true })
    .fill(env.AUTH_EMAIL_PASSWORD);
  await page
    .getByRole("button", { name: "Iniciar sesión", exact: true })
    .click();
  await page.waitForURL("http://localhost:3000/es", { timeout: 3000 });
  await page.goto("http://localhost:3000/es/problems/reverse-the-array");
  await page.getByText("Ejecutar").waitFor();
  await page.getByRole("button", { name: "Ejecutar" }).click();
  await expect(page.getByTestId("result")).toHaveText("Respuesta correcta");
  await expect(page.getByText("Tiempo de ejecución")).toHaveText(
    /Tiempo de ejecución: .* segundos/,
  );
  await expect(page.getByText("Cantidad de memoria usada")).toHaveText(
    /Cantidad de memoria usada: .* kB/,
  );
});
