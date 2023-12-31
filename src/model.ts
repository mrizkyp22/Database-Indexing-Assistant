export interface QueryInfo {
    database: string;
    collection: string;
    queries: { [key: string]: string | boolean | number}[];
    nameIndex: string;
    indexes:  string;
}