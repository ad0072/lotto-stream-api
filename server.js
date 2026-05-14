import express from "express";
import { chromium } from "playwright";

const app = express();

const PORT = process.env.PORT || 3000;

app.get("/", async (req, res) => {

  let browser;

  try {

    browser = await chromium.launch({
      headless: true,
      executablePath:
        "/opt/render/.cache/ms-playwright/chromium-1223/chrome-linux/chrome",
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });

    const page = await browser.newPage();

    await page.goto("https://exphuay.com", {
      waitUntil: "domcontentloaded",
      timeout: 120000
    });

    await page.waitForTimeout(5000);

    let streamUrl = null;

    page.on("request", request => {

      const url = request.url();

      if (url.includes("/api/stream/home")) {
        streamUrl = url;
      }

    });

    await page.goto(
      "https://exphuay.com/result/laosdevelops",
      {
        waitUntil: "domcontentloaded",
        timeout: 120000
      }
    );

    await page.waitForTimeout(10000);

    return res.json({
      status: "success",
      streamUrl
    });

  } catch (error) {

    return res.status(500).json({
      status: "error",
      message: error.message
    });

  } finally {

    if (browser) {
      await browser.close();
    }

  }

});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
