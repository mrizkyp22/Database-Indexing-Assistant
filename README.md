# Database Indexing Assistant

Database Indexing Assistant is a tool designed to facilitate the examination and management of indexes within a database system. It automates the process of checking whether database queries are properly indexed and offers the capability to create indexes automatically if any query is found to be lacking proper indexing. The tool streamlines this entire process and generates automated reports containing crucial information such as database name, collection, query details, data types, and sample values.

## Features

### Automatic Index Checking
Database Indexing Assistant performs automated checks on database queries to determine whether they are efficiently indexed. The tool provides a detailed report on the indexing status of each query.

### Automatic Index Creation
When the tool detects queries that lack proper indexing, it can automatically create indexes to enhance query performance in the future.

### Automatic Report Generation
Upon completion of the indexing checks and, if necessary, index creation, the tool generates comprehensive reports automatically. These reports include essential information such as the database name, collection name, examined queries, data types of relevant columns, and sample values from query results.

## Usage Requirements

Users are required to prepare data in an Excel format with the following columns:

- Database name
- Collection name
- Query to be examined
- Desired index name
- Field name to be indexed

Users are required to prepare env data in an .env format with the following :

```MONGODB_DATABASE_URL=mongodb://localhost:2717```

## Usage Instructions

1. Run `npm install` to install the required dependencies.
2. Import the Excel `data.xlsx` into Database Indexing Assistant.
3. Create a `.env` file and provide the MongoDB connection URL using the variable `MONGODB_DATABASE_URL`.
4. Run the tool by executing `npm run start`.
5. The tool will examine each query in the list and provide index status reports.
6. If needed, the tool will create new indexes.
7. After completion, the tool will generate automated reports in the format described above.


With the Database Indexing Assistant, the tasks of checking and managing indexes within a database become more efficient and automated.

Feel free to [contribute](CONTRIBUTING.md) to the development of Database Indexing Assistant!
