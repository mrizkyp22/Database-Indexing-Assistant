import { MongoClient } from 'mongodb';
import PDFDocument from 'pdfkit';
import fs from 'fs'; // Import the fs module
import { queryInfos } from './queries';

export async function checkIndexUsage() {
  const uri = 'mongodb://apm:kwBYomFR5b62Uptx@localhost:2003/?authSource=approvalmanagement';
  const client = new MongoClient(uri);

  const pdfDoc = new PDFDocument(); // Create a new PDF document

  try {
    await client.connect();

    // Add header to the PDF document
    pdfDoc.font('Helvetica-Bold').fontSize(18).text('Indexing Result', { align: 'center' });

    for (const queryInfo of queryInfos) {
      const database = client.db(queryInfo.database);
      const collection = database.collection(queryInfo.collection);

      for (const query of queryInfo.queries) {
        const explainOutput = await collection.find(query).explain('executionStats');
        const executionStages = explainOutput.executionStats.executionStages;
        const stage = executionStages.stage;

        pdfDoc.font('Helvetica').fontSize(12);
        pdfDoc.moveDown();

        pdfDoc.text('Database: ', { continued: true }).font('Helvetica-Bold').text(`${queryInfo.database}`, { continued: true }).font('Helvetica').text(' || Collection: ',{ continued: true }).font('Helvetica-Bold').text(`${queryInfo.collection}`).font('Helvetica');
        pdfDoc.text('Query Check: ', { continued: true }).font('Helvetica-Bold').text(`${JSON.stringify(query)}`).font('Helvetica');

        if (stage === "COLLSCAN") {
          pdfDoc.text('Result: Used an ', { continued: true }).font('Helvetica-Bold').text('COLLSCAN (collection scan)', { continued: true }).font('Helvetica').text(' without index..');

        } else if (stage === "FETCH") {
          const inputStage = executionStages.inputStage;
          const inputStageType = inputStage.stage;

          if (inputStageType === "IXSCAN") {
            pdfDoc.text('Result: Used an ', { continued: true }).font('Helvetica-Bold').text('IXSCAN', { continued: true }).font('Helvetica').text(' index.');
          } else {
            pdfDoc.text('Result: Used a different index type or combination.');
          }
        } else {
          pdfDoc.text('Result: Used a different execution stage.');
        }
        pdfDoc.text('=================================================');
      }
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();

    // Save the PDF document to a file
    pdfDoc.pipe(fs.createWriteStream('index_usage_report3.pdf')); // Adjust the file name as needed
    pdfDoc.end();
  }
}

checkIndexUsage();
