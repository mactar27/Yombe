import mysql from 'mysql2/promise';

async function test() {
  const pool = mysql.createPool({
    host: 'localhost',
    user: 'root', // assuming default or no pass for local test, wait, what is the DB config?
  });
}
