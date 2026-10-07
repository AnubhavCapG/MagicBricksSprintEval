import type { Page } from '@playwright/test';

/**
 * Waits until React has hydrated the server-rendered app mounted on `rootSelector`.
 * Results and details pages render their HTML first and attach click handlers
 * about half a second after `load`. Clicks made before that are silently lost.
 * React marks its root element with a `__reactContainer$<id>` property once it has mounted.
 */
export async function waitForHydration(page: Page, rootSelector: string): Promise<void> {
  await page.waitForFunction((selector) => {
    const root = document.querySelector(selector);
    return root !== null && Object.keys(root).some((key) => key.startsWith('__reactContainer'));
  }, rootSelector);
}
