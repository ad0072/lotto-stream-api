import express from "express";
import puppeteer from "puppeteer";

const app = express();

app.get("/", async (req, res) => {
  res.json({
    status: "success",
    message: "server working"
  });
});

app.get("/stream", async (req, res) => {
  let browser;

  try {
    browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox"
      ]
    });

    const page = await browser.newPage();

    await page.goto("https://example.com", {
      waitUntil: "networkidle2",
      timeout: 60000
    });

    const title = await page.title();

    await browser.close();

    res.json({
      status: "success",
      title: title
    });

  } catch (error) {

    if (browser) {
      await browser.close();
    }

    res.json({
      status: "error",
      message: error.message
    });
  }
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
