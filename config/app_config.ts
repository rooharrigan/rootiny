import {ConnectionOptions} from 'typeorm';
import "reflect-metadata";

export const dbOptions: ConnectionOptions = {
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "****",
    database: "hivetestdb",
    entities: [
         "./entities/*.js"
    ],
    synchronize: true,
}
