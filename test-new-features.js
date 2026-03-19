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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
var path_1 = require("path");
var API_BASE = 'http://localhost:5173/api/sql';
var MOCK_FILES_DIR = path_1.default.join(process.cwd(), 'src/public/uploads/backups');
function testAuditLogs() {
    return __awaiter(this, void 0, void 0, function () {
        var empRes, _a, _b, empData_1, logRes, logs, foundLog, err_1;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    console.log('--- Testing Audit Logs through Employee Creation ---');
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 9, , 10]);
                    return [4 /*yield*/, fetch("".concat(API_BASE, "/employees"), {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                name: 'Audit Test Employee',
                                email: "audit.test.".concat(Date.now(), "@example.com"),
                                phone: '1234567890',
                                designation: 'Tester',
                                basicSalary: 5000,
                                status: 'Active',
                            })
                        })];
                case 2:
                    empRes = _c.sent();
                    if (!!empRes.ok) return [3 /*break*/, 4];
                    _a = Error.bind;
                    _b = "Failed to create employee: ".concat;
                    return [4 /*yield*/, empRes.text()];
                case 3: throw new (_a.apply(Error, [void 0, _b.apply("Failed to create employee: ", [_c.sent()])]))();
                case 4: return [4 /*yield*/, empRes.json()];
                case 5:
                    empData_1 = _c.sent();
                    console.log("\u2705 Dummy Employee created with ID: ".concat(empData_1.data.id));
                    // Wait briefly for async log
                    return [4 /*yield*/, new Promise(function (r) { return setTimeout(r, 1000); })];
                case 6:
                    // Wait briefly for async log
                    _c.sent();
                    return [4 /*yield*/, fetch("".concat(API_BASE, "/audit-logs?limit=5"))];
                case 7:
                    logRes = _c.sent();
                    return [4 /*yield*/, logRes.json()];
                case 8:
                    logs = _c.sent();
                    foundLog = logs.data.find(function (log) { return log.action === 'employee.create' && log.entity_id === empData_1.data.id; });
                    if (foundLog) {
                        console.log('✅ EMPLOYEE_CREATE successfully found in audit trails!');
                    }
                    else {
                        console.error('❌ Missing EMPLOYEE_CREATE log!', logs.data);
                    }
                    return [3 /*break*/, 10];
                case 9:
                    err_1 = _c.sent();
                    console.error('Failed Audit Log tests:', err_1);
                    return [3 /*break*/, 10];
                case 10: return [2 /*return*/];
            }
        });
    });
}
function runAll() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, testAuditLogs()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
runAll();
