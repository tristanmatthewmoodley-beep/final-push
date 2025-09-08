const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');

async function extractProductsFromPdf() {
  try {
    const pdfPath = path.join(__dirname, '../GW-Aug-Sep-2025-Leaflet-Final.pdf');
    const dataBuffer = fs.readFileSync(pdfPath);
    
    console.log('Extracting text from PDF...');
    const data = await pdf(dataBuffer);
    
    console.log('PDF Text Content:');
    console.log('================');
    console.log(data.text);
    console.log('================');
    console.log(`Total pages: ${data.numpages}`);
    console.log(`Total text length: ${data.text.length}`);
    
    // Save the raw text to a file for analysis
    const outputPath = path.join(__dirname, '../extracted-pdf-content.txt');
    fs.writeFileSync(outputPath, data.text);
    console.log(`Raw text saved to: ${outputPath}`);
    
  } catch (error) {
    console.error('Error extracting PDF:', error);
  }
}

extractProductsFromPdf();
