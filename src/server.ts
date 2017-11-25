import * as express from "express";
import "reflect-metadata";
import {createExpressServer} from "routing-controllers";
import { SeriesController } from "./controller/SeriesController";
import { createConnection } from "typeorm";



//const app = express();

class Response<T>{
    limit: number;
    offset: number;
    results: [T];

    constructor(limit: number, offset: number, results: [T]) {
        this.limit = limit;
        this.offset = offset;
        this.results = results;
    }
}

createConnection().then(async connection => {
    const app = createExpressServer({
        controllers: [SeriesController] // we specify controller we want to use
    });


    app.listen(3000, () => console.log('Comic Cloud API listening on port 3000!'));


}).catch(error => console.log("TypeORM connection error: ", error));