import mysql from "mysql2";

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  port: 3306,
  password: "123456",
  database: "petshop_db",
});
export default connection;
