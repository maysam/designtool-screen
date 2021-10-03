const puppeteer = require('puppeteer');
const express = require('express');
var cors = require('cors');
const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());

app.get('/screenshot', async (req, res) => {
    const browser = await puppeteer.launch({
        args: ['--no-sandbox']
    });

    const page = await browser.newPage();
    console.log(req.query)
    await page.setViewport({
        width: parseInt(req.query.width),
        height: parseInt(req.query.height),
    })
    await page.goto(`http://54.87.243.134/#/view/${req.query.id}`,{ waitUntil: 'networkidle0' }); // URL is given by the "user" (your client-side application)
    // await page.goto(`http://localhost:3000/#/view/${req.query.id}`,{ waitUntil: 'networkidle0' });
    await page.evaluateHandle('document.fonts.ready');
    const screenshotBuffer = await page.screenshot();

    // Respond with the image
    res.writeHead(200, {
        'Content-Type': 'image/png',
        'Content-Length': screenshotBuffer.length
    });
    res.end(screenshotBuffer);

    await browser.close();
})

app.get('/', function (req, res) {
  res.send('hello world')
})

app.listen(PORT, () => {
    console.log(`app running on port: ${ PORT }`)
});
