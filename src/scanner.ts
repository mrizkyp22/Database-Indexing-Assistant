import { MongoClient } from 'mongodb';
import { queryInfos } from './queries';

async function checkIndexUsage() {

  const uri = 'mongodb://localhost:2717'; // Update with your MongoDB URI
  const client = new MongoClient(uri);

  try {
    await client.connect();

    for (const queryInfo of queryInfos) {
      console.log("scanner.ts",queryInfo.database)

      const database = client.db(queryInfo.database);
      const collection = database.collection(queryInfo.collection);

      for (const query of queryInfo.queries) {
        const explainOutput = await collection.find(query).explain('executionStats');
        const executionStages = explainOutput.executionStats.executionStages;
        const stage = executionStages.stage;

        console.log(`Database: ${queryInfo.database}, Collection: ${queryInfo.collection}`);
        console.log('Query:', JSON.stringify(query));

        if (stage === "COLLSCAN") {
          console.log('  Used a COLLSCAN (collection scan) without index.');
        } else if (stage === "FETCH") {
          const inputStage = executionStages.inputStage;
          const inputStageType = inputStage.stage;

          if (inputStageType === "IXSCAN") {
            console.log('  Used an IXSCAN index.');
          } else {
            console.log('  Used a different index type or combination.');
          }
        } else {
          console.log('  Used a different execution stage.');
        }

        console.log('--------------------------------------------');
      }
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

checkIndexUsage();
