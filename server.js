const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/screenshot', async (req, res) => {
  try {
    const url = req.query.url;
    
    if (!url) {
      return res.status(400).send('URL parameter is required');
    }

    console.log('Generating screenshot for:', url);
    
    const browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage'
      ]
    });
    
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 630 });
    await page.goto(url, { 
      waitUntil: 'networkidle2',
      timeout: 30000
    });
    
    const screenshot = await page.screenshot({ 
      type: 'png',
      fullPage: false
    });
    
    await browser.close();
    
    res.set('Content-Type', 'image/png');
    res.set('Content-Disposition', 'inline; filename="screenshot.png"');
    res.send(screenshot);
    
    console.log('Screenshot generated successfully');
    
  } catch (error) {
    console.error('Error generating screenshot:', error);
    res.status(500).send('Error generating screenshot: ' + error.message);
  }
});

app.get('/health', (req, res) => {
  res.send('OK');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
