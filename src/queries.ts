import * as XLSX from 'xlsx';
import { QueryInfo } from './model';

const workbook = XLSX.readFile('assets/data.xlsx');
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];

const jsonData = XLSX.utils.sheet_to_json(sheet);

export const queryInfos: QueryInfo[] = jsonData.map((entry: any) => {
    const queries: { [key: string]: string | boolean | number}[] = [];

    const queryGroups = entry.queries.match(/\{.*?\}/g);

    if (queryGroups) {
        queryGroups.forEach((group: string) => {
            const queryPairStrings = group.slice(1, -1).split(',').map(part => part.trim());
            const query: { [key: string]: string | boolean } = {};
            queryPairStrings.forEach((pairString) => {
                const [key, value] = pairString.split(':').map(part => part.trim());
                let cleanValue: string | boolean = value;

                if (value.startsWith('"') && value.endsWith('"')) {
                    cleanValue = value.slice(1, -1); // Remove quotes from value
                } else if (value === 'true') {
                    cleanValue = true;
                } else if (value === 'false') {
                    cleanValue = false;
                }

                query[key] = cleanValue;
            });
            queries.push(query);
        });
    }

    return {
        database: entry.database,
        collection: entry.collection,
        queries: queries,
        nameIndex: entry.nameIndex,
        indexes: entry.indexes
    };
});

// console.log("Query Infos:", queryInfos);
