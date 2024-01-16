
const express = require('express')
const mysql = require('mysql')

const app = express()
const port = 3000

const config = {
    host: 'db',
    user: 'root',
    password: 'root',
    database: 'nodedb'
}

const connection = mysql.createConnection(config);

//  start db
const createTableSql = `
  CREATE TABLE IF NOT EXISTS people (
    id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    PRIMARY KEY (id)
  );
`;

connection.query(createTableSql, (err)=> {
    if (err)
        return console.error('Error Creating Table' + err.stack)

    console.log('Table Created Successfully')
})

const sql = `
  INSERT IGNORE INTO people (id, name)
  SELECT * FROM (SELECT 1, 'Michael') AS tmp
  WHERE NOT EXISTS (
      SELECT id FROM people WHERE id = 2
  ) LIMIT 1;
`;
connection.query(sql);



app.get('/', (req, res) => {
    const sqlPeoples = `SELECT * FROM people`;
    connection.query(sqlPeoples, (err, results) => {
      if (err) {
        console.error('Error fetching data from MySQL: ' + err.stack);
        res.status(500).send('Internal Server Error');
        return;
      }

      const html = `
      <html>
        <head>
          <title>People Data</title>
        </head>
        <body>
          <h1>Full Cycle Rocks!</h1>
          <br />
          <h3>People Data</h3>
          <table>
            <tr>
              <th>ID</th>
              <th>Name</th>
            </tr>
            ${results.map((row) => `
              <tr>
                <td>${row.id}</td>
                <td>${row.name}</td>
              </tr>
            `).join('')}
          </table>
        </body>
      </html>
    `;
    res.send(html);
  });
});


app.listen(port, () => {
    console.log(`App listening on port ${port}!`)
})