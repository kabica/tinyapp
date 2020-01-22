// expresS_server.js

const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
app.set("view engine", "ejs");

const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

// ============================== GLOBALS ================================= //

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
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

// ============================== FUNCTIONS ================================= //

function generateRandomString() {
  let chars = "123456789abcdefghiklmnopqrstuvwxyz";
	let string_length = 6;
	let randomstring = '';
	for (let i = 0; i < string_length; i++) {
		var rnum = Math.floor(Math.random() * chars.length);
		randomstring += chars.substring(rnum,rnum+1);
  }
  return randomstring;
}

const getKey = function(obj , value) {
  const result = '';
  for(const x in obj) {
    if(obj[x] === value) {
      result = x;
      return result;
    }
  }
  return 0;
};

const checkEmail = function(object , email) {
  result = 1;
  Object.keys(object).forEach(val => {
    if(object[val]['email'] === email) {
      result = 0;
      return result;
    }
  });

  return result;
}


// ============================== GET REQUESTS ================================= //

app.get("/urls/new", (req, res) => {
  let templateVars = { username: req.cookies['username'] };
  res.render("urls_new" , templateVars);
});

app.get("/", (req, res) => {
  res.send("Hello!");
  sds;
});

app.get("/urls", (req, res) => {
  let templateVars = { username: req.cookies['username'] , urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];

  const templateVars = { username: req.cookies['username'] , shortURL , longURL };

  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  res.redirect(longURL);
});

app.get("/register", (req, res) => {

  res.render("urls_user");
});

// ============================== POST REQUESTS ================================= //

app.post("/urls", (req, res) => {
  const longURL = req.body.longURL;
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = longURL;
  // res.redirect(`/urls/${shortURL}`);    
  res.redirect('/urls');            
});


app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect('/urls');                
});

app.post("/urls/:shortURL", (req, res) => {
  console.log('hi');
  const shortURL = req.params.shortURL;
  res.redirect(`/urls/${shortURL}`);                
});

app.post("/urls/:shortURL/edit", (req, res) => {
  const longURL = req.body.longURL;
  const shortURL = req.params.shortURL;

  delete urlDatabase[shortURL];
  urlDatabase[shortURL] = longURL;

  res.redirect('/urls');                
});

app.post("/login", (req, res) => {
  res.cookie("username" , req.body.username);
  res.redirect('/urls');                
});

app.post("/logout", (req, res) => {
  res.clearCookie('username');
  res.status(200).redirect('/urls');               
});

app.post("/register", (req, res) => {
	const test = req.body.emailAddress;

	// Check if valid email and password input
  	if(test.length !== 0 && checkEmail(users , test)) {
  		let newUser = {};
  		userID = generateRandomString();

  		newUser['id'] = userID;
  		newUser['email'] = req.body.emailAddress;
  		newUser['password'] = req.body.password;

  		users[userID] = newUser;
  		res.cookie("user_id" , userID);
  		res.redirect('/urls')
  	}
  	// Email or password is invalid
  	else {
  		res.status(400).send('Invalid email / password'); 
  	}
 
});




// ================================== LISTEN ===================================== //

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

