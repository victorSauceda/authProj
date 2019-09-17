const sqlite3 = require('sqlite3').verbose();
const express = require('express');
const passport = require('passport')
const session = require('express-session')
const bodyParser = require('body-parser')
// const path = require('path');
const promisify = require('util').promisify;
const bcrypt = require('bcrypt');
const saltRounds = 10;
const app = express();
// const GithubStrategy = require('passport-github').Strategy;
const port = process.env.PORT || 5000;
var LocalStrategy = require('passport-local').Strategy;

// app.use(express.static(path.join(__dirname, 'build')));

let db = new sqlite3.Database("./mydb.sqlite3", (err) => {
  if (err) {
    console.log('Error when creating the database', err)
  } else {
    console.log('Database created!')
    /* Put code to create table(s) here */
    db.serialize(function () {
      // db.run(create database if not exists)s
      db.run("CREATE TABLE IF NOT EXISTS `UserData` (`name` TEXT, `password` TEXT)");
    })
  }
});

// var users = [{"id":req.body.name, "username":"amy", "password":"amyspassword"}];
// passport needs ability to serialize and unserialize users out of session
passport.serializeUser(async function (user, done) {
  done(null, user.name);
});
passport.deserializeUser(async function (name, done) {
  try{
 const user =  await dbget("select * from UserData where name=?",name)
  done(null, user)
    }catch(err){
      done(err)
    }

})


// passport local strategy for local-login, local refers to this app
passport.use('local-login', new LocalStrategy(
  
  async function (username, password, done) {
    const user =  await dbget("select * from UserData where name=?",username)
      if (user &&  bcrypt.compareSync(password, user.password)) {
          return done(null, user);
      } else {
          return done(null, false, {"message": "User not found."});
      }
  })
);

// body-parser for retrieving form data
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));

// initialize passposrt and and session for persistent login sessions
app.use(session({
  secret: "tHiSiSasEcRetStr",
  resave: true,
  saveUninitialized: true }));
app.use(passport.initialize());
// app.use(passport.session());

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
      return next();

  res.sendStatus(401);
}

app.get("/", function (req, res) {
  res.redirect('/login')
  res.send("login");
});

// api endpoints for login, content and logout
app.get("/login", function (req, res) {
  res.redirect('/login')
  res.send("login");
});
app.post("/login", 
  passport.authenticate("local-login", { failureRedirect: "/login"}),
  function (req, res) {
      res.redirect("/Main");
});
app.get("/Main", isLoggedIn, function (req, res) {
  res.redirect('/Main')
  res.send("/Main");
});
app.get("/logout", function (req, res) {
  req.logout();
  res.send("logout success!");
});


let dbrun = promisify(db.run).bind(db);
let dbget = promisify(db.get).bind(db);
app.use(bodyParser());
app.post('/register', async function (req, res) {
  if (!req.body || !req.body.name) {
    res.status(400);
    res.send("bad request");
  }
  let user = await dbget("select * from UserData where name=?", req.body.name);
  if (!user) {
    let user = req.body;
    const hash = await bcrypt.hash(req.body.password, saltRounds);
    await dbrun("INSERT INTO UserData (name,password) VALUES(?,?)", user.name, hash);
    res.status(201);
    console.log('its not');
  } else {
    if (req.body.password !== user.password) {
      res.status(403);
      console.log('invalid');
      res.send('unauthorized');
      return;
    }
    res.status(200);
    console.log('it is 200');
  }
  res.send('success');
});
// function d(msg) {
//   console.log(msg);
// }

// ///localstrategy

// module.exports = async function (passport) {

//   // =========================================================================
//   // passport session setup ==================================================
//   // =========================================================================
//   // required for persistent login sessions
//   // passport needs ability to serialize and unserialize users out of session

//   // used to serialize the user for the session
//   passport.serializeUser(async function (user, done) {

//     done(null, user.name);
  
//   });

//   // used to deserialize the user
//   passport.deserializeUser(async function (name, done) {

//     await dbget("select * from Userdata where name=?", name, async function (err, rows) {
     
//       done(err, rows[0]);
//     })

//   });

// 	// =========================================================================
//     // LOCAL SIGNUP ============================================================
//     // =========================================================================
//     // we are using named strategies since we have one for login and one for signup
// 	// by default, if there was no name, it would just be called 'local'

//   passport.use('local-signup', new LocalStrategy({
//     // by default, local strategy uses username and password, we will override with email
//     usernameField : 'email',
//     passwordField : 'password',
//     passReqToCallback : true // allows us to pass back the entire request to the callback
    
// },
// async function(req, name, password, done) {
// name=req.body.name;
// password=req.body.password;
// // find a user whose email is the same as the forms email
// // we are checking to see if the user trying to login already exists
//    await dbget("select * from UserData where name =?",name, async function(err,rows){
//   console.log(rows);
//   console.log("above row object");
//   if (err)
//             return done(err);
//    if (rows.length) {
//             return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
//         } else {

//     // if there is no user with that email
//             // create the user
//             let newUserMysql = {
    
//             name: 'name',
//             password: 'password' // use the generateHash function in our user model
//             }
  
//     let insertQuery = await dbrun("INSERT INTO UserData ( name, password ) values (?,?)", name,password);
//       console.log(insertQuery);
//    await dbrun(insertQuery,function(err,rows){
//     newUserMysql.name = rows.name;
    
//     return done(null, newUserMysql);
//     });	
//         }	
// });
// }));


//  // =========================================================================
//     // LOCAL LOGIN =============================================================
//     // =========================================================================
//     // we are using named strategies since we have one for login and one for signup
//     // by default, if there was no name, it would just be called 'local'

//     passport.use('local-login', new LocalStrategy({
//       // by default, local strategy uses username and password, we will override with email
//       usernameField : 'name',
//       passwordField : 'password',
//       passReqToCallback : true // allows us to pass back the entire request to the callback
//   },
//  async function(req, name, password, done) { // callback with email and password from our form
// name=req.body.name
//      await dbget("select * from UserData where name =?",name, async function(err,rows){
//     if (err)
//               return done(err);
//      if (!rows.length) {
//               return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
//           } 
    
//     // if the user is found but the password is wrong
//           if (!( rows[0].password === password))
//               return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
    
//           // all is well, return successful user
//           return done(null, rows[0]);			
  
//   });
  


//   }));

// };


  app.post('/login', async function (req, res) {
    if (!req.body || !req.body.name) {
      res.status(400);
      res.send("bad request");
    }
    let user = await dbget("select * from UserData where name=?", req.body.name);
    if (!user) {
      let user = req.body;
      const hash = await bcrypt.hash(req.body.password, saltRounds);
      await dbrun("INSERT INTO UserData (name,password) VALUES(?,?)", user.name, hash);
      res.status(201);
      console.log('its not');
    } else {
      const vaildPassword = await bcrypt.compare(req.body.password, user.password);
      if (!vaildPassword) {
        res.status(403);
        console.log('invalid');
        res.send('unauthorized');
        return;
      }
      res.status(200);
      console.log('it is 200');
    }
    res.send('success');
  });


//   passport.use(new GithubStrategy({
//     clientID: "e3d3d955206532b18862",
//     clientSecret: "2ec464d6b37f292ff42dd367685a566a977cc709",
//     callbackURL: "http://localhost:5001/auth/github/callback"
//   },
//     function (accessToken, refreshToken, profile, done) {
//       // placeholder for translating profile into your own custom user object.
//       // for now we will just use the profile object returned by GitHub
//       return done(null, profile);
//     }
//   ));
//   // Express and Passport Session
//   app.use(session({ secret: "enter custom sessions secret here" }));
//   app.use(passport.initialize());
//   app.use(passport.session());
//   passport.serializeUser(function (user, done) {
//     // placeholder for custom user serialization
//     // null is for errors
//     done(null, user);
//   });
//   passport.deserializeUser(function (user, done) {
//     // placeholder for custom user deserialization.
//     // maybe you are getoing to get the user from mongo by id?
//     // null is for errors
//     done(null, user);
//   });
//   // we will call this to start the GitHub Login process

//   app.get('/auth/github', passport.authenticate('github'));
//   // GitHub will call this URL

//   app.get('/auth/github/callback',
//     passport.authenticate('github', { failureRedirect: '/' }),
//     function (req, res) {
//       res.redirect('/');
//     });

//   app.get('/', function (req, res) {
//     var html = `<ul>\
//     <li><a href='/auth/github'>GitHub</a></li>\
//    <li><a href='/logout'>logout</a></li>\
// </ul> `;
//     // dump the user for debugging
//     if (req.isAuthenticated()) {
//       html += "<p>authenticated as user:</p>"
//       html += "<pre>" + JSON.stringify(req.user, null, 4) + "</pre>";
//     }
//     res.send(html);
//   });
//   app.get('/logout', function (req, res) {
//     console.log('logging out');
//     req.logout();
//     res.redirect('/');
//   });
//   // Simple route middleware to ensure user is authenticated.
//   //  Use this route middleware on any resource that needs to be protected.  If
//   //  the request is authenticated (typically via a persistent login session),
//   //  the request will proceed.  Otherwise, the user will be redirected to the
//   //  login page.
//   function ensureAuthenticated(req, res, next) {
//     if (req.isAuthenticated()) { return next(); }
//     res.redirect('/')
//   }
//   app.get('/protected', ensureAuthenticated, function (req, res) {
//     res.send("acess granted");
//   });
  app.listen(port, () => console.log(`Listening on port ${port}`));










