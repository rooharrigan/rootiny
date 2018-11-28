import * as Koa from 'koa';
import * as Router from 'koa-router';
import * as Logger from 'koa-logger';
import { pipeline } from 'stream';
import { greetVisitor } from './lib/lib_validate';
import { validate_token, validate_event_type } from './lib/lib_validate';
import { ApiTrackInputs, TrackEventType, TrackEventPageViewPayload, TrackEventUserPayload } from './types/types_logic';
import { userInfo } from 'os';
import { page_views_main } from './lib/lib_page_views';
import { QueryError, RowDataPacket, FieldPacket, OkPacket} from 'mysql2';
import 'reflect-metadata';
import { ConnectionOptions, createConnection } from 'typeorm';
import { PageView } from './entities/ud_page_views';
import { getPool } from './db/db_client';
import * as appConfig from '../config/app_config';


/*
* Start the database
*/ 
createConnection(appConfig.dbOptions).then(async connection =>{
    console.log("Connected to db");
}).catch(error => console.log("TypeORM connection error: ", error));

/*
* Configure app helpers
*/
const app = new Koa();
const router = new Router();
const logger = require('koa-logger');
const koaBody = require('koa-body');
const test_data = require('./data_track.json');

app.use(router.routes());
app.use(router.allowedMethods());
app.use(koaBody());
if (process.env.NODE_ENV == "development") {
    app.use(logger());
}

/*
* API routing logic
*/
router.get('/', async (ctx, next) => {
    let visitor = "Roo!";
    ctx.body = greetVisitor(visitor);
});

router.post('/track', koaBody(),
    async (ctx) => {
        ctx.body = "You made it to track";

        const parsed_params = ctx.request.body as ApiTrackInputs;

        const visitor_token = parsed_params.visitor_token;
        let token = validate_token(visitor_token);

        let event_type = parsed_params.event_type;
        event_type = validate_event_type(event_type);

        // Type things nicely
        switch (event_type) {
            case TrackEventType.page_view: {
                console.log('you are in track page_view');

                const parsed_payload = JSON.parse(parsed_params.payload) as TrackEventPageViewPayload;
                
                let ret = page_views_main(visitor_token, parsed_payload);
                console.log(parsed_payload);
                break;
            }

            case TrackEventType.user: {
                const parsed_payload = JSON.parse(parsed_params.payload) as TrackEventUserPayload;
                break;
            }

            default: {
                console.log("not supposed to get here");
                break;
            }

        }

        // Route to the subsequent event logic

        // Return useful error code or ok statement
    }
);

router.get('/reports/pages', async (ctx, next) => {
    ctx.body = "you made it to pages";
});

router.get('/reports/visitors', async (ctx, next) => {
    ctx.body = "you made it to visitors";

});

const port = 3000;
const server = app.listen(port);
console.log(
    "Server running on port %d in %s mode",
    port,
    app.env,
);

/*
* Exports for testing
*/
module.exports = app;