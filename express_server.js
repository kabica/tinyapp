// expresS_server.js

const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");
const bcrypt = require('bcrypt');
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
app.use(bodyParser.urlencoded({extended: true}));

app.use(cookieSession({
  name: 'session',
  keys: ['secret', 'terces'],

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))

const {
  getUserByEmail,
  generateRandomString,
  checkEmail,
  checkPW,
  getPW, 
  urlsForUser
} = require('./helper')
  // ============================== GLOBALS ================================= //

const urlDatabase = {
  alex: {
    longURL: "https://www.tsn.ca",
    userID: "userRandomID"
  },
  bica: {
    longURL: "https://www.google.ca",
    userID: "userRandomID"
  }
};

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
}

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
    const templateVars = {
      user
    };
    res.render("urls_new", templateVars);
  } else {
    res.redirect('/urls');
  }
});


app.get("/urls", (req, res) => {
  const userID = req.session.user_id
  const user = users[userID];
  const myURL = urlsForUser(urlDatabase , userID);
  const templateVars = {
    user: user,
    urls: myURL
  };
  res.render("urls_index", templateVars);
});


app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  console.log(shortURL);
  const longURL = urlDatabase[shortURL]['longURL'];
  console.log(longURL);
  const userID = req.session.user_id;
  const user = users[userID];

  const templateVars = {
    user: user,
    shortURL,
    longURL
  };
  res.render("urls_show", templateVars);
});


app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params['shortURL'];
  const longURL = urlDatabase[shortURL]['longURL'];

  res.redirect(longURL);
});



// ============================== POST REQUESTS ================================= //

app.post("/urls", (req, res) => {
  const longURL = req.body.longURL;
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
  const longURL = req.body['longURL'];
  const userID = req.session.user_id;

  if (urlDatabase[shortURL]['userID'] === userID) {
    urlDatabase[shortURL]['longURL'] = longURL;
  }

  res.redirect('/urls');
});


app.post("/login", (req, res) => {
  const pw = req.body['password'];
  const email = req.body['emailAddress'];
  const pwStored = getPW(users , email);
  //const hashedPassword = bcrypt.hashSync(pw, 10);

  let userID = getUserByEmail(users, email);
  if (!checkEmail(users, email) && bcrypt.compareSync(pw, pwStored)) {
    console.log('LOGGED IN');
    req.session.user_id = userID;
    res.redirect('/urls');
  } else {
    res.status(400).send('Invalid email / password');
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
    userID = generateRandomString();

    newUser['id'] = userID;
    newUser['email'] = req.body.emailAddress;
    newUser['password'] = hashedPassword;

    users[userID] = newUser;
    req.session.user_id = userID;
    res.redirect('/urls')
  } else {
    res.status(400).send('Invalid email / password');
  }
});


// ================================== LISTEN ===================================== //

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});