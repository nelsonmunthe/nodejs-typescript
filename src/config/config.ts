import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();
const { PGDATABASE, PGPASSWORD, PGHOST, PGPORT, PGUSER } = process.env

// create connection
const database = new Sequelize('postgres', 'postgres', 'Lumbanpaung,050490', {
    host: 'localhost',
    dialect: 'postgres',
    port: 5432,
    pool: {
        max: 50,
        min: 10,
        acquire: 60000,
        idle: 10000,
    },
});

// export connection
export default  database;

