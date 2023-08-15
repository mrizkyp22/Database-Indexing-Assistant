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

    for (const queryInfo of queryInfos) {
      const database = client.db(queryInfo.database);
      const collection = database.collection(queryInfo.collection);

      for (const query of queryInfo.queries) {
        const explainOutput = await collection.find(query).explain('executionStats');
        const executionStages = explainOutput.executionStats.executionStages;
        const stage = executionStages.stage;

        pdfDoc.text(`Database: ${queryInfo.database}, Collection: ${queryInfo.collection}`);
        pdfDoc.text(`Query Check: ${JSON.stringify(query)}`);

        if (stage === "COLLSCAN") {
          pdfDoc.text('Result: Used a COLLSCAN (collection scan) without index.');
        } else if (stage === "FETCH") {
          const inputStage = executionStages.inputStage;
          const inputStageType = inputStage.stage;

          if (inputStageType === "IXSCAN") {
            pdfDoc.text('Result: Used an IXSCAN index.');
          } else {
            pdfDoc.text('Result: Used a different index type or combination.');
          }
        } else {
          pdfDoc.text('Result: Used a different execution stage.');
        }

        pdfDoc.moveDown(); // Add some spacing between logs
      }
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();

    // Save the PDF document to a file
    pdfDoc.pipe(fs.createWriteStream('index_usage_report.pdf')); // Adjust the file name as needed
    pdfDoc.end();
  }
}

checkIndexUsage();
