import { QueryInfo } from "./model";
import * as fs from 'fs';

// Read data from data.json
const rawData = fs.readFileSync('assets/data.json', 'utf-8');
export const queryInfos: QueryInfo[] = JSON.parse(rawData);