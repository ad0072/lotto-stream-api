import express from "express";
import { chromium } from "playwright";

const app = express();

const PORT = process.env.PORT || 10000;

app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "server working"
  });
});

app.get("/stream", async (req, res) => {

  let browser = null;

  try {

    browser = await chromium.launch();

    const page = await browser.newPage();

    await page.goto("https://example.com");

    const title = await page.title();

    await browser.close();

    return res.json({
      status: "success",
      title: title
    });

  } catch (error) {

    console.log(error);

    if (browser) {
      await browser.close();
    }

    return res.status(500).json({
      status: "error",
      message: error.message
    });

  }

});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
