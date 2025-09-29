import mysql from "mysql2/promise";

let pool ;

const connectDB = async () => {
  try {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    //test the connection
    const connection = await pool.getConnection();
    console.log("Database is connected!");
    connection.release();
  } catch (error) {
    console.log("Error in connecting Database!");
  }

};

const getpool=()=>{
  if(!pool){
    console.log("Pool doesnt exit,Iniziatize db first");
    return null;
  }
  return pool;
}
export { connectDB , getpool};
