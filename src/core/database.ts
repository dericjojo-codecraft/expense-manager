import mysql from 'mysql2/promise';
import process from 'node:process';

export default async function initDatabase() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST ?? '',
        user: process.env.DB_USER ?? '',
        password: process.env.DB_PASSWORD ?? '',
        database: process.env.DB_NAME ?? ''
    });

    await connection.execute(`
        CREATE TABLE IF NOT EXISTS friends (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE,
            phone VARCHAR(20) UNIQUE,
            balance INT, 
            isActive TINYINT(1) NOT NULL DEFAULT 1
        )
    `);

    return connection;
}