import { MongoClient } from 'mongodb';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import { queryInfos } from './queries';

export async function checkIndexUsage() {
  const uri = 'mongodb://apm:kwBYomFR5b62Uptx@localhost:2003/?authSource=approvalmanagement';
  // const uri = 'mongodb://localhost:2717';
  const client = new MongoClient(uri);

  const pdfDoc = new PDFDocument();

  // Initialize counters
  let countTotal = 0;
  let IXScanTotal = 0;
  let CollScanTotal = 0;

  try {
    await client.connect();

    const timestamp = new Date().toISOString().replace(/:/g, '-');
    const pdfFileName = `reports/index_usage_report_${timestamp}.pdf`;

    pdfDoc.pipe(fs.createWriteStream(pdfFileName));

    pdfDoc.font('Helvetica-Bold').fontSize(18).text('Indexing Result', { align: 'center' });

    for (const queryInfo of queryInfos) {
      console.log(queryInfo)
      const database = client.db(queryInfo.database);
      const collection = database.collection(queryInfo.collection);

      for (const query of queryInfo.queries) {
        // console.log(query)
        const explainOutput = await collection.find(query).explain('executionStats');
        const executionStages = explainOutput.executionStats.executionStages;
        const stage = executionStages.stage;

        // Increment counters based on execution stage
        countTotal++;
        if (stage === 'COLLSCAN') {
          CollScanTotal++;
        } else if (stage === 'FETCH') {
          const inputStage = executionStages.inputStage;
          const inputStageType = inputStage.stage;

          if (inputStageType === 'IXSCAN') {
            IXScanTotal++;
          }
        }

        // Add query information to the PDF document
        pdfDoc.font('Helvetica').fontSize(12);
        pdfDoc.moveDown();
        pdfDoc.text('Database: ', { continued: true }).font('Helvetica-Bold').text(`${queryInfo.database}`, { continued: true }).font('Helvetica').text(' || Collection: ', { continued: true }).font('Helvetica-Bold').text(`${queryInfo.collection}`).font('Helvetica');
        pdfDoc.text('Query Check: ', { continued: true }).font('Helvetica-Bold').text(`${JSON.stringify(query)}`).font('Helvetica');

        if (stage === 'COLLSCAN') {
          pdfDoc.text('Result: Used a ', { continued: true }).font('Helvetica-Bold').text('COLLSCAN (collection scan)', { continued: true }).font('Helvetica').text(' without index..');
        } else if (stage === 'FETCH') {
          const inputStage = executionStages.inputStage;
          const inputStageType = inputStage.stage;

          if (inputStageType === 'IXSCAN') {
            pdfDoc.text('Result: Used an ', { continued: true }).font('Helvetica-Bold').text('IXSCAN', { continued: true }).font('Helvetica').text(' index.');
          } else {
            pdfDoc.text('Result: Used a different index type or combination.');
          }
        } else {
          pdfDoc.text('Result: Used a different execution stage.');
        }
        pdfDoc.text('=================================================');      }
    }

    // Add summary section below the header
    pdfDoc.moveDown().text('Summary:').font('Helvetica').fontSize(12);
    pdfDoc.text(`Total Queries: ${countTotal}`);
    pdfDoc.text(`Total IXSCAN: ${IXScanTotal}`);
    pdfDoc.text(`Total COLLSCAN: ${CollScanTotal}`);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();

    pdfDoc.end();
  }
}

checkIndexUsage();