import chromium from "@sparticuz/chromium";
import { ApiHandler } from "sst/node/api";
import { Time } from "@html-to-pdf/core/time";
import puppeteer from "puppeteer-core";

export const handler = ApiHandler(async (_evt) => {
    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(
        "/opt/nodejs/node_modules/@sparticuz/chromium/bin"
      ),
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });

    console.log("Loading Page");
    const page = await browser.newPage();
    await page.goto("https://www.letsgetchecked.com/mobile/privacy-policy/");
    const pageTitle = await page.title();
    console.log("Page Loaded", pageTitle);


  
    const pdf = await page.pdf();
    pdf.toString('base64');
  return {
    statusCode: 200,
    isBase64Encoded: true,
    headers: { "Content-Type": "application/pdf" },
    body: pdf.toString('base64'),
  };
});
