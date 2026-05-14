import express from "express";
import puppeteer from "puppeteer";

const app = express();

const PORT = process.env.PORT || 10000;

app.get("/", (req, res) => {
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

    await page.goto("https://example.com");

    const title = await page.title();

    await browser.close();

    res.json({
      status: "success",
      title: title
    });

  } catch (err) {

    if (browser) {
      await browser.close();
    }

    res.status(500).json({
      status: "error",
      message: err.message
    });

  }

});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
