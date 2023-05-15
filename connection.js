const mssql = require('mssql/msnodesqlv8');
//require('dotenv').config();
const Connection = require('tedious').Connection;
//const Request = require('tedious').Request;

// const options = {
//    // encrypt: false,
//    // enableArithAbort: false,
//     trustedConnection: true
// }
// const getDataConfig = () => ({
//            // port: parseInt(process.env.DB_PORT, 10),
//             //driver: process.env.SQL_UK_DRIVER,
//             server: process.env.DB_HOST,
//             database: process.env.DB_NAME,
//            // user: process.env.SQL_UK_UID,
//           //  password: process.env.SQL_UK_PWD,
//             options: options
// });

const config = {
    server: 'LAPTOP-SH93NFD2',
    database: 'cafenodejs',
    driver: 'msnodesqlv8',
    authentication: {
        type: 'default',
        options: {
          userName: 'admin',
          password: '12345'
        }
      },
    port: 1433,
    options: {
        instanceName: 'SQLEXPRESS',
        trustedConnection: false,
        trustServerCertificate: true,
       // rowCollectionOnDone: true
       rowCollectionOnRequestCompletion:true
    }
};

//var connection = mssql.createConnection(config);
//var connection = new mssql.ConnectionPool(getDataConfig());
const connection = new Connection(config);

connection.connect((err) => {
    if(!err) {
        console.log('connected');
    }
    else{
        console.log(err);
    }
});




module.exports = connection;