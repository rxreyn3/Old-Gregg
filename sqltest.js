require('dotenv').config()

var Connection = require('tedious').Connection
var Request = require('tedious').Request

// Create connection to database
var config =
   {
     userName: process.env.DB_USERNAME,
     password: process.env.DB_PASSWORD,
     server: process.env.DB_SERVER,
     options:
        {
          database: process.env.DB_DATABASE, // update me
          encrypt: true
        }
   }
var connection = new Connection(config)

// Attempt to connect and execute queries if connection goes through
connection.on('connect', function (err) {
  if (err) {
    console.log(err)
  } else {
    queryDatabase()
  }
})

function queryDatabase () {
  console.log('Reading rows from the Table...')

  // Read all rows from table
  var request = new Request(
    'SELECT TOP 20 * FROM [VRG].[Vecs]',
    function (err, rowCount, rows) {
      if (err) {
        console.log(err)
      } else {
        console.log(rowCount + ' row(s) returned')
        process.exit()
      }
    }
  )

  request.on('row', function (columns) {
    columns.forEach(function (column) {
      console.log('%s\t%s', column.metadata.colName, column.value)
    })
  })
  connection.execSql(request)
}
