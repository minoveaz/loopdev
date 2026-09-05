import { expect, test } from '@playwright/test';

function createPdfBuffer() {
  const stream = 'BT /F1 24 Tf 72 110 Td (LoopDev) Tj ET\n';
  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 300 200] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
    `<< /Length ${Buffer.byteLength(stream)} >>\nstream\n${stream}endstream`,
  ];
  let pdf = '%PDF-1.4\n';
  const offsets = [0];
  objects.forEach((object, index) => {
    offsets.push(Buffer.byteLength(pdf));
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });
  const xrefOffset = Buffer.byteLength(pdf);
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, '0')} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  return Buffer.from(pdf, 'latin1');
}

test.describe('DocumentViewer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/document-intelligence/new');
    await expect(page.locator('button').filter({ hasText: 'Seleccionar documento' })).toBeVisible();
  });

  test('supports explicit fit, zoom, rotate and reset controls', async ({ page }) => {
    const input = page.locator('input[type="file"]').first();
    await input.setInputFiles({
      name: 'document-viewer.png',
      mimeType: 'image/png',
      buffer: Buffer.from(
        '<svg xmlns="http://www.w3.org/2000/svg" width="640" height="420"><rect width="640" height="420" fill="#fff"/></svg>',
      ),
    });

    await expect(page.getByRole('toolbar', { name: 'Controles de vista previa' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Ajustar' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    await page.getByRole('button', { name: 'Ancho' }).click();
    await expect(page.getByRole('button', { name: 'Ancho' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    await page.getByRole('button', { name: 'Ampliar documento' }).click();
    await page.getByRole('button', { name: 'Girar 90 grados' }).click();
    await expect(page.getByRole('button', { name: '125%' })).toBeVisible();
    await page.getByRole('button', { name: '125%' }).click();
    await expect(page.getByRole('button', { name: '100%' })).toBeVisible();
    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(hasHorizontalOverflow).toBe(false);
  });

  test('keeps the viewer reachable on compact mobile without page overflow', async ({ page }) => {
    await page
      .locator('input[type="file"]')
      .first()
      .setInputFiles({
        name: 'compact.png',
        mimeType: 'image/png',
        buffer: Buffer.from(
          '<svg xmlns="http://www.w3.org/2000/svg" width="320" height="480"><rect width="320" height="480" fill="#fff"/></svg>',
        ),
      });

    await expect(page.getByRole('button', { name: 'Abrir en pestaña nueva' })).toBeVisible();
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(overflow).toBe(false);
  });

  test('renders a valid PDF through the PDF.js canvas engine', async ({ page }) => {
    await page.locator('input[type="file"]').first().setInputFiles({
      name: 'document-viewer.pdf',
      mimeType: 'application/pdf',
      buffer: createPdfBuffer(),
    });

    await expect(page.locator('[data-document-viewer-pdf-canvas="true"]')).toBeVisible({
      timeout: 15_000,
    });
  });
});
