import chromium from "@sparticuz/chromium";
import { ApiHandler, useQueryParam } from "sst/node/api";
import puppeteer from "puppeteer";

// const puppeteer = process.env.IS_LOCAL ? await import ('puppeteer') : puppeteerCore;

export const handler = ApiHandler(async (evt) => {
  const path = useQueryParam("path");

  const pathToPdf =
    path || "https://www.google.com/";

  const chromiumPath = process.env.IS_LOCAL
    ? undefined
    : await chromium.executablePath(
        "/opt/nodejs/node_modules/@sparticuz/chromium/bin"
      );

  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: chromiumPath,
    headless: chromium.headless,
    ignoreHTTPSErrors: true,

  });

  console.log("Loading Page");
  const page = await browser.newPage();
  await page.goto(pathToPdf, {waitUntil: 'networkidle2' });
  const pageTitle = await page.title();
  console.log("Page Loaded", pageTitle);

  
  const pdf = await page.pdf({
    margin:{
      bottom: '10mm',
      top: '10mm',
      right: '10mm',
      left: '10mm',
    },
    width: '2480px',
    height: '3508px',
  });

  browser.close();
  return {
    statusCode: 200,
    isBase64Encoded: true,
    headers: { "Content-Type": "application/pdf" },
    body: pdf.toString("base64"),
  };
});
