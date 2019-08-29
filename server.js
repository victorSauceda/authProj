var sqlite3 = require('sqlite3').verbose();


const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');
const app = express();
const port= process.env.PORT || 5000

app.use(bodyParser());

app.post('/user', function(req, res){
  let user=req.body;
  db.run("INSERT INTO UserData (name) VALUES(?)",user.name, function(err, row){
    if (err) {
      console.log(err);
      throw err;
    }

    res.status = 200;
    res.end(row);
  });
});

app.use(express.static(path.join(__dirname, 'build')));
let db = new sqlite3.Database("./mydb.sqlite3", (err) => { 
  if (err) { 
      console.log('Error when creating the database', err) 
  } else { 
      console.log('Database created!') 
      /* Put code to create table(s) here */
      db.serialize(function() {
        // db.run(create database if not exists)
        db.run("CREATE TABLE IF NOT EXISTS `UserData` (`name` TEXT)");
        
      })
  } 
})

app.listen(port, () => console.log(`Listening on port ${port}`));
