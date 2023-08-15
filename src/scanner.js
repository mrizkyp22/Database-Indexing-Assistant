"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongodb_1 = require("mongodb");
function checkIndexUsage() {
    return __awaiter(this, void 0, void 0, function () {
        var uri, client, queryInfos, _i, queryInfos_1, queryInfo, database, collection, _a, _b, query, explainOutput, executionStages, stage, inputStage, inputStageType, error_1;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    uri = 'mongodb://localhost:2717';
                    client = new mongodb_1.MongoClient(uri);
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 9, 10, 12]);
                    return [4 /*yield*/, client.connect()];
                case 2:
                    _c.sent();
                    queryInfos = [
                        {
                            database: 'test',
                            collection: 'users',
                            queries: [
                                //   { /* Query criteria 1 here */ },
                                { userId: "userid090820231791" },
                                //   { /* Query criteria 2 here */ },
                                { roleId: "user" }
                                // Add more queries for this collection
                            ],
                        },
                        {
                            database: 'test',
                            collection: 'auth',
                            queries: [
                                { roleId: "user" },
                                //   { /* Query criteria 2 here */ },
                                // Add more queries for this collection
                            ],
                        },
                        // Add more objects for more databases and collections
                    ];
                    _i = 0, queryInfos_1 = queryInfos;
                    _c.label = 3;
                case 3:
                    if (!(_i < queryInfos_1.length)) return [3 /*break*/, 8];
                    queryInfo = queryInfos_1[_i];
                    database = client.db(queryInfo.database);
                    collection = database.collection(queryInfo.collection);
                    _a = 0, _b = queryInfo.queries;
                    _c.label = 4;
                case 4:
                    if (!(_a < _b.length)) return [3 /*break*/, 7];
                    query = _b[_a];
                    return [4 /*yield*/, collection.find(query).explain('executionStats')];
                case 5:
                    explainOutput = _c.sent();
                    executionStages = explainOutput.executionStats.executionStages;
                    stage = executionStages.stage;
                    console.log("Database: ".concat(queryInfo.database, ", Collection: ").concat(queryInfo.collection));
                    console.log('Query:', JSON.stringify(query));
                    if (stage === "COLLSCAN") {
                        console.log('  Used a COLLSCAN (collection scan) without index.');
                    }
                    else if (stage === "FETCH") {
                        inputStage = executionStages.inputStage;
                        inputStageType = inputStage.stage;
                        if (inputStageType === "IXSCAN") {
                            console.log('  Used an IXSCAN index.');
                        }
                        else {
                            console.log('  Used a different index type or combination.');
                        }
                    }
                    else {
                        console.log('  Used a different execution stage.');
                    }
                    console.log('--------------------------------------------');
                    _c.label = 6;
                case 6:
                    _a++;
                    return [3 /*break*/, 4];
                case 7:
                    _i++;
                    return [3 /*break*/, 3];
                case 8: return [3 /*break*/, 12];
                case 9:
                    error_1 = _c.sent();
                    console.error('Error:', error_1);
                    return [3 /*break*/, 12];
                case 10: return [4 /*yield*/, client.close()];
                case 11:
                    _c.sent();
                    return [7 /*endfinally*/];
                case 12: return [2 /*return*/];
            }
        });
    });
}
checkIndexUsage();
