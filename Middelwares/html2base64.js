// const fs = require('fs');

// const htmlContent = `
//   <html>
//     <head><title>Test</title></head>
//     <body>
//       <h1>Hello, World!</h1>
//       <p>This is a custom HTML content.</p>
//     </body>
//   </html>
// `;

// const base64 = Buffer.from(htmlContent, 'utf8').toString('base64');
// const dataUri = base64;

// console.log(dataUri);

// // Optionally write to a .txt file for use elsewhere
// fs.writeFileSync('base64Output.pdf', dataUri);


const fs = require('fs');
const puppeteer = require('puppeteer');

const htmlContent = `
  <html>
    <head>
      <title>Invoice</title>
      <style>
        body { font-family: Arial; padding: 20px; }
        h1 { color: darkblue; }
      </style>
    </head>
    <body>
      <h1>Hello Rakesh 👋</h1>
      <p>This is your test invoice.</p>
    </body>
  </html>
`;

// Step 1: Save raw HTML file
fs.writeFileSync('invoice.html', htmlContent, 'utf8');

// Step 2: Encode HTML to Base64 and save
const htmlBase64 = Buffer.from(htmlContent, 'utf8').toString('base64');
fs.writeFileSync('html_base64.txt', htmlBase64, 'utf8');

// Step 3: Generate PDF and save it
(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: 'load' });

  const pdfBuffer = await page.pdf({ format: 'A4' });

  fs.writeFileSync('invoice.pdf', pdfBuffer); // save PDF file

  // Step 4: Convert PDF to Base64 and save
  const pdfBase64 = pdfBuffer.toString('base64');
  fs.writeFileSync('pdf_base64.txt', pdfBase64, 'utf8');

  await browser.close();

  console.log("✅ Done: HTML + PDF + both base64 files created.");
})();
