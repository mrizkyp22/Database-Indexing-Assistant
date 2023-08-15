// import { readExcelFile, QueryInfo } from './excelReader';

// const excelFilePath = 'assets/data.xlsx';
// export const queryInfos: QueryInfo[] = readExcelFile(excelFilePath);

// console.log("queryInfos: ",queryInfos);

interface QueryInfo {
    database: string;
    collection: string;
    queries: any[]; // Define your query structures here
  }

  

export const queryInfos: QueryInfo[] = [
    {
      database: 'test', // Update with your database name
      collection: 'users', // Update with your collection name
      queries: [
      {userId:"userid090820231791"},
      {roleId:"user"}
        // Add more queries for this collection
      ],
    },
    {
      database: 'test', // Update with another database name
      collection: 'auth', // Update with another collection name
      queries: [
        {roleId:"user"},
        // Add more queries for this collection
      ]
    }
    // Add more objects for more databases and collections
  ];