import { Database, OPEN_READWRITE, OPEN_CREATE } from 'sqlite3';
import { promisify } from 'util';

const db = new Database('my-database.db', OPEN_READWRITE | OPEN_CREATE, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

const run = promisify(db.run.bind(db));
const get = promisify(db.get.bind(db));
const all = promisify(db.all.bind(db));

export const connectDB = () => {
    return {
        run,
        get,
        all,
    };
};