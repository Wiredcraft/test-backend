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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const sequelize_typescript_1 = require("sequelize-typescript");
const config_1 = require("../config");
const seq = new sequelize_typescript_1.Sequelize(config_1.MYSQL);
function default_1() {
    return __awaiter(this, void 0, void 0, function* () {
        // const seq = new Sequelize(MYSQL);
        seq.addModels([path_1.default.resolve(__dirname, './models/')]);
        yield seq.sync({ force: true });
    });
}
exports.default = default_1;
exports.seq = seq;
//# sourceMappingURL=index.js.map