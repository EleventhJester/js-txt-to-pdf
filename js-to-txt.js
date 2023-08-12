const fs = require('fs');
const PDFDocument = require('pdfkit');

// Read the text from the .txt file
let text = '';

try {
    text = fs.readFileSync('motivatie.txt', 'utf-8');
} catch (error) {
    console.error('Error reading motivatie.txt:', error.message);
    process.exit(1); // Exit the process with an error code
}

// Remove Windows-style carriage returns (\r) from the text
text = text.replace(/\r/g, '');

// Create a PDF document
const doc = new PDFDocument({ size: 'letter' });
doc.pipe(fs.createWriteStream('output.pdf'));

// Split the text into paragraphs
const paragraphs = text.split('\n\n');

// Define styles for the document
const normalStyle = { fontSize: 12 };

// Create a list to hold the content (paragraphs and spacers)
const content = [];

// Add each paragraph to the content list
paragraphs.forEach(paragraph => {
    const trimmedParagraph = paragraph.trim();
    content.push({ text: '\n', margin: [0, 12] }); // Add some space between paragraphs
    content.push({ text: trimmedParagraph, style: 'normal' });
});

// Apply styles to the document
doc.font('Helvetica'); // Set the default font

// Add content to the document
content.forEach(item => {
    if (item.text === '\n') {
        doc.moveDown(item.margin[1] / doc.currentLineHeight());
    } else {
        doc.fontSize(normalStyle.fontSize).text(item.text);
    }
});

// Finalize and save the PDF document
doc.end();
