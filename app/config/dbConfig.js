import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
    username: process.env.DB_USERNAME || 'defaultUsername',
    password: process.env.DB_PASSWORD || 'defaultPassword',
    host: process.env.DB_HOST || 'localhost',
    dbName: process.env.DB_NAME || 'myDatabase',
    getConnectionString: function () {
        return `mongodb+srv://${this.username}:${this.password}@${this.host}/${this.dbName}`;
    }
};

export default dbConfig;
