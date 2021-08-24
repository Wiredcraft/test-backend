import path from 'path';
import { Sequelize } from 'sequelize-typescript';
import { MYSQL } from "../config";

const seq = new Sequelize(MYSQL);

export default async function () {
    // const seq = new Sequelize(MYSQL);

    seq.addModels([path.resolve(__dirname, './models/')]);

    await seq.sync({ force: true });
}

exports.seq = seq