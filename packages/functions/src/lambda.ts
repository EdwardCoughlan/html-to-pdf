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


  

  return {
    statusCode: 200,
    body: `Hello world. The time is ${Time.now()}`,
  };
});
