const { chromium } = require('playwright');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

(async () => {
  const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
  try {
    const page = await browser.newPage();
    await page.goto(pathToFileURL(path.resolve(__dirname, '../portfolio-print.html')).href);
    await page.waitForSelector('html[data-ready="true"]');
    await page.pdf({ path: path.resolve(__dirname, '../assets/portfolio.pdf'), format: 'A4', preferCSSPageSize: true, printBackground: false });
    console.log('Generated assets/portfolio.pdf from current portfolio content. Review pagination before publishing.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
