import { MongoClient } from 'mongodb';

interface QueryInfo {
  database: string;
  collection: string;
  queries: any[]; // Define your query structures here
}

async function checkIndexUsage() {
  const uri = 'mongodb://localhost:2717'; // Update with your MongoDB URI
  const client = new MongoClient(uri);

  try {
    await client.connect();

    const queryInfos: QueryInfo[] = [
      {
        database: 'test', // Update with your database name
        collection: 'users', // Update with your collection name
        queries: [
        //   { /* Query criteria 1 here */ },
        {userId:"userid090820231791"},
        //   { /* Query criteria 2 here */ },
        {roleId:"user"}
          // Add more queries for this collection
        ],
      },
      {
        database: 'test', // Update with another database name
        collection: 'auth', // Update with another collection name
        queries: [
          {roleId:"user"},
        //   { /* Query criteria 2 here */ },
          // Add more queries for this collection
        ],
      },
      // Add more objects for more databases and collections
    ];

    for (const queryInfo of queryInfos) {
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
