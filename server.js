import express from "express";
import { chromium } from "playwright";

const app = express();

app.get("/", async (req, res) => {
  let browser;

  try {
    browser = await chromium.launch({
      headless: true,
      executablePath: "/opt/render/.cache/ms-playwright/chromium-1223/chrome-linux/chrome",
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });

    const page = await browser.newPage();

    let foundApi = null;

    page.on("response", async (response) => {
      const url = response.url();

      if (
        url.includes("/api/stream/") ||
        url.includes(".m3u8") ||
        url.includes("live")
      ) {
        foundApi = url;
      }
    });

    await page.goto("https://exphuay.com", {
      waitUntil: "networkidle",
      timeout: 120000
    });

    await page.waitForTimeout(15000);

    await browser.close();

    if (foundApi) {
      return res.json({
        status: "success",
        api: foundApi
      });
    }

    return res.json({
      status: "error",
      message: "ไม่พบ stream API"
    });

  } catch (err) {

    if (browser) {
      await browser.close();
    }

    return res.json({
      status: "error",
      message: err.message
    });
  }
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
