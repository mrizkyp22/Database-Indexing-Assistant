import { MongoClient } from 'mongodb';

async function checkIndexUsage() {
  const uri = 'mongodb://localhost:2717'; // Update with your MongoDB URI
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db('test'); // Update with your database name
    const collection = database.collection('users'); // Update with your collection name

    // Define an array of queries you want to analyze
    const queries = [
      { userId:"userid090820231791"},
      { roleId:"user" },
      // Add more queries as needed
    ];

    for (const query of queries) {
      // Explain the query execution
      const explainOutput = await collection.find(query).explain('executionStats');

      // Access the execution stages
      const executionStages = explainOutput.executionStats.executionStages;
      const stage = executionStages.stage;

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
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

checkIndexUsage();
