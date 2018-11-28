import { SQLStatement } from "sql-template-strings";
import { VError } from "verror";
import * as mysql from "mysql2/promise";
import { Query } from "mysql2/promise";
import * as config from "config";
import * as uuid from "uuid";


export type Results = [mysql.RowDataPacket[], mysql.FieldPacket[]];
export type Row = mysql.RowDataPacket;
export interface ResultSetHeader {
affectedRows: number;
}

let _pool: mysql.Pool | null = null;

/*
* Query builder helper functions
*/
export async function query(statement: SQLStatement): Promise<Row[]> {
    const pool = getPool();

    let results: Results;

    try {
    results = await pool.query<mysql.RowDataPacket[]>(statement);
    } catch (err) {
    throw new VError(
        {
        name: "sql_error:query",
        cause: err,
        info: {
            sql: statement.sql,
            values: "redacted"
        }
        },
        "could not perform query"
    );
    }

    return results[0];
}
    
export async function single(statement: SQLStatement): Promise<Row | null> {
    const rows = await query(statement);
    if (rows.length == 0) return null;

    return rows[0];
}

/*
* Manage database pool connections
*/
export function getPool(): mysql.Pool {
    if (_pool !== null) return _pool;

    _pool = mysql.createPool({
        host: config.get("db.host"),
        user: config.get("db.user"),
        password: config.get("db.password"),
        database: config.get("db.database"),
        charset: "utf8mb4"
    });

    return _pool;
  }

export async function close(): Promise<void> {
    if (_pool !== null) {
      await _pool.end();
      _pool = null;
    }
  }
  