// expresS_server.js
const { secretKeys  } = require('./data');
const express = require("express");
const app = express();
const PORT = 8080;


app.set("view engine", "ejs");
const bcrypt = require('bcrypt');
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
app.use(bodyParser.urlencoded({extended: true}));

app.use(cookieSession({
  name: 'session',
  keys: secretKeys, // Nice try :)
  maxAge: 24 * 60 * 60 * 1000
}));
// ================================= GLOBALS =================================== //

const {
  getUserByEmail,
  generateRandomString,
  checkEmail,
  getPW,
  urlsForUser
} = require('./helper');

const { urlDatabase , users } = require('./data');

// ============================== GET REQUESTS ================================= //

app.get("/", (req, res) => {
  res.redirect('/urls');
});

app.get("/register", (req, res) => {
  res.render("urls_user");
});

app.get("/login", (req, res) => {
  res.render("urls_login");
});

app.get("/urls/new", (req, res) => {
  const userID = req.session.user_id;

  if (userID) {
    const user = users[userID];
    const templateVars = { user };
    res.render("urls_new", templateVars);
  } else {
    res.redirect('/urls');
  }
});

app.get("/urls", (req, res) => {
  const userID = req.session.user_id;
  const user = users[userID];
  const myURL = urlsForUser(urlDatabase , userID);
  const templateVars = {
    user: user,
    urls: myURL
  };
  // If user is not logged in, redirect to login page 
  if(!user) {
    res.redirect('/login');
  } else {
    res.render("urls_index", templateVars);
  }
});

app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL]['longURL'];
  const userID = req.session.user_id;
  const user = users[userID];

  let templateVars = { user: user, shortURL, longURL };
  if(userID) {
    res.render("urls_show", templateVars);
  } else {
    // TYPE 0: user not logged in    TYPE 1: invalid username or password
    templateVars = {type: 0, error: 'You must be logged in to view this content!'};
    res.render('urls_error', templateVars);
  }
  });

app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params['shortURL'];
  const longURL = urlDatabase[shortURL]['longURL'];
  res.redirect(longURL);
});



// ============================== POST REQUESTS ================================= //

app.post("/urls", (req, res) => {
  let longURL = req.body.longURL;
  if(longURL.substring(0,7) !== 'http://') { // ADDRESSES: Cannot read property 'longURL' of undefined.
    longURL = 'http://' + longURL;
  }
  const userID = req.session.user_id;
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = {longURL: longURL , userID: userID};
  res.redirect('/urls');
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const userID = req.session.user_id;
  const shortURL = req.params['shortURL'];
  if (urlDatabase[shortURL]['userID'] === userID) {
    delete urlDatabase[shortURL];
    res.redirect('/urls');
  } else {
    res.redirect('/urls');
  }
});

app.post("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  res.redirect(`/urls/${shortURL}`);
});

app.post("/urls/:shortURL/edit", (req, res) => {
  const shortURL = req.params['shortURL'];
  let longURL = req.body['longURL'];
  const userID = req.session.user_id;
  if(longURL.substring(0,7) !== 'http://') {
    longURL = 'http://' + longURL;
  }
  if (urlDatabase[shortURL]['userID'] === userID) {
    urlDatabase[shortURL]['longURL'] = longURL;
  }
  res.redirect('/urls');
});

app.post("/login", (req, res) => {
  const pwClient = req.body['password'];
  const email = req.body['emailAddress'];
  const pwServer = getPW(users , email);

  let userID = getUserByEmail(users, email);
  if (!checkEmail(users, email) && bcrypt.compareSync(pwClient, pwServer)) {
    req.session.user_id = userID;
    res.redirect('/urls');
  } else {
    // TYPE 0: issue with valid-user credentials   TYPE 1: issue with non-valid-user credentials
    templateVars = {type: 0, error: 'Invalid username or password'};
    res.render('urls_error', templateVars);
  }
});

app.post("/logout", (req, res) => {
  req.session = null;
  res.status(200).redirect('/urls');
});

app.post("/register", (req, res) => {
  const test = req.body.emailAddress;
  const password = req.body['password'];
  const hashedPassword = bcrypt.hashSync(password, 10);

  if (test.length !== 0 && checkEmail(users, test)) {
    let newUser = {};
    const userID = generateRandomString();

    const userEmail = req.body.emailAddress;
    newUser = { 'id': userID , 'email': userEmail , 'password' : hashedPassword };

    users[userID] = newUser;
    req.session.user_id = userID;
    res.redirect('/urls');
  } else {
    // TYPE 0: issue with valid-user credentials   TYPE 1: issue with non-valid-user credentials
    templateVars = {type: 1, error: 'Username is already in use'};
    res.render('urls_error', templateVars);
  }
});


// ================================== LISTEN ===================================== //


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});