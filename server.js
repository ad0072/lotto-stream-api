```javascript id="wpk7o1"
import express from "express";
import { chromium } from "playwright";

const app = express();

const PORT = process.env.PORT || 3000;

app.get("/", async (req, res) => {

  let browser;

  try {

    browser = await chromium.launch({
      headless: true
    });

    const page = await browser.newPage();

    // เปิดเว็บ exphuay
    await page.goto("https://exphuay.com", {
      waitUntil: "networkidle",
      timeout: 120000
    });

    // รอโหลด
    await page.waitForTimeout(5000);

    // ดัก API
    let streamUrl = null;

    page.on("request", request => {

      const url = request.url();

      if (url.includes("/api/stream/home")) {
        streamUrl = url;
      }

    });

    // เปิดหน้าผลหวย
    await page.goto(
      "https://exphuay.com/result/laosdevelops",
      {
        waitUntil: "networkidle",
        timeout: 120000
      }
    );

    // รอ API ทำงาน
    await page.waitForTimeout(8000);

    if (!streamUrl) {

      return res.status(500).json({
        status: "error",
        message: "ไม่พบ stream API"
      });

    }

    // ใช้ browser session เดิมเรียก API
    const result = await page.evaluate(async (url) => {

      const response = await fetch(url, {
        headers: {
          "accept": "text/event-stream"
        }
      });

      return await response.text();

    }, streamUrl);

    return res.json({
      status: "success",
      api: streamUrl,
      raw: result
    });

  } catch (error) {

    return res.status(500).json({
      status: "error",
      message: error.message,
      stack: error.stack
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
```
