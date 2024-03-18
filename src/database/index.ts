import { Client } from 'pg'

// TODO: Terminar.
interface DBAdapter {
    query(sql: string): QueryResult
}

interface QueryResult {
    rows: Array<Row>
}

type Row = {
    name: string
    value: any
}

/**
 * TODO: Crear un adapter para sqlite3.Database y pg.Client. El adapter debe de tener métodos para manejar queries en sql.
 */
export default class Database {
    private readonly connectionURL = process.env.DB_URL || ""
    private _postgres?: Client

    constructor() {
        if (this.connectionURL === "") throw new Error("database connection string is empty")

        this._postgres = new Client({
            connectionString: this.connectionURL,
        })

        try {
            (async () => {
                await this._postgres!.connect()
            })()
        } catch(err) {
            throw err
        }
    }

    async onPG(callback: (pg: Client) => void | Promise<void>): Promise<void> {
        if (this._postgres) {
            try {
                await callback(this._postgres)
            } catch(err) {
                throw err
            }
        }
    }
}