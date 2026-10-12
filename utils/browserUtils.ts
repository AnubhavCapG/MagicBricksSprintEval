import {
  chromium,
  webkit,
  Browser,
  BrowserType,
} from "@playwright/test";

export type BrowserName = "chromium" | "msedge" | "webkit";

export class BrowserUtils {
  static getBrowserType(browserName: BrowserName): BrowserType {
    switch (browserName) {
      case "chromium":
        return chromium;

      case "msedge":
        return chromium;

      case "webkit":
        return webkit;

      default:
        throw new Error(`Unsupported browser: ${browserName}`);
    }
  }

  static async launchBrowser(browserName: BrowserName): Promise<Browser> {
    const browserType = BrowserUtils.getBrowserType(browserName);

    return await browserType.launch({
      headless: false,
      ...(browserName === "msedge" ? { channel: "msedge" } : {}),
    });
  }
}
