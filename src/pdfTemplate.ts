import PDFDocument from 'pdfkit';
import fs from 'fs';

export function createPDF(queryInfo: string, query: string, result: string): PDFDocument {
  const pdfDoc = new PDFDocument();

  pdfDoc.text(`Database: ${queryInfo}`);
  pdfDoc.text(`Query Check: ${query}`);
  pdfDoc.text(`Result: ${result}`);

  pdfDoc.moveDown();

  return pdfDoc;
}

export function savePDF(pdfDoc: PDFDocument, fileName: string) {
  pdfDoc.pipe(fs.createWriteStream(fileName));
  pdfDoc.end();
}
