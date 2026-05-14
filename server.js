import express from "express";
import { chromium } from "playwright";

const app = express();

app.get("/", async (req, res) => {

  let browser;

  try {

    browser = await chromium.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox"
      ]
    });

    const page = await browser.newPage();

    let urls = [];

    page.on("response", async (response) => {

      const url = response.url();

      if (
        url.includes(".m3u8") ||
        url.includes("/api/stream/") ||
        url.includes("playlist")
      ) {
        urls.push(url);
      }

    });

    await page.goto("https://exphuay.com", {
      waitUntil: "domcontentloaded",
      timeout: 120000
    });

    await page.waitForTimeout(10000);

    await browser.close();

    return res.json({
      status: "success",
      total: urls.length,
      urls
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

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
