import * as fs from 'fs';
import { QueryInfo } from './model';

// Read data from data.json
const rawData = fs.readFileSync('assets/data.json', 'utf-8');
export const queryInfos: QueryInfo[] = JSON.parse(rawData);

// console.log (queryInfos)

// const data = fs.readFileSync('myfile.txt', 'utf-8');

// console.log(data);
