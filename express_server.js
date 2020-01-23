// expresS_server.js

const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
app.set("view engine", "ejs");

const bcrypt = require('bcrypt');
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

// ============================== GLOBALS ================================= //

const urlDatabase = {
  alex: { longURL: "https://www.tsn.ca", userID: "userRandomID" },
  bica: { longURL: "https://www.google.ca", userID: "userRandomID" }
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
};
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
  let result = 1;
  Object.keys(object).forEach(val => {
    if(object[val]['email'] === email) {
      result = 0;
      return result;
    }
  });

  return result;
};
const checkPW = function(object , pw) {
  let result = 0;
  Object.keys(object).forEach(val => {
    if(object[val]['password'] === pw) {
      result = 1;
      return result;
    }
  });

  return result;
};
const getEmail = function(object , email) {
  let result = '';
  Object.keys(object).forEach(val => {
    if(object[val]['email'] === email) {
      result = val;
      return result;
    }
  });

  return result;
};
const urlsForUser = function(id) {
	let result = [];
	Object.keys(urlDatabase).forEach(key => {
		if(urlDatabase[key]['userID'] === id) {
			let urls = {}
			urls['shortURL'] = key;
			urls['longURL'] = urlDatabase[key]['longURL'];
			result.push(urls);
		}
	})
	return result;
};

const getURLKey = function (object , id) {
	let urlKey = '';
	Object.keys(urlDatabase).forEach(key => {
		if(urlDatabase[key]['userID'] === id) {
			urlKey = key;
			return key;
		}
	})
	return urlKey;
}

// ============================== GET REQUESTS ================================= //

app.get("/urls/new", (req, res) => {
  const userID = req.cookies['user_id'];
  if(userID){
  	const user = users[userID];
  	const templateVars = { user };
  	res.render("urls_new" , templateVars);
  } 
  else {
  	res.redirect('/urls');
  }
});

app.get("/", (req, res) => {
  res.send("Hello!");
});
app.get("/urls", (req, res) => {
  const userID = req.cookies['user_id'];
  const user = users[userID];
  const myURL = urlsForUser(userID);
  const templateVars = { user: user, urls: myURL };
 
  res.render("urls_index", templateVars);
});
app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];

  const userID = req.cookies['user_id'];
  const user = users[userID];

  const templateVars = { user: user , shortURL , longURL };
  // const templateVars = { username: req.cookies['username'] , shortURL , longURL };

  res.render("urls_show", templateVars);
});
app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params['shortURL'];
  const longURL = urlDatabase[shortURL]['longURL'];

  res.redirect(longURL);
});
app.get("/register", (req, res) => {

  res.render("urls_user");
});
app.get("/login", (req, res) => {

  res.render("urls_login");
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
  const userID = req.cookies['user_id'];
  const shortURL = req.params['shortURL'];
  if(urlDatabase[shortURL]['userID'] === userID) {
  	delete urlDatabase[shortURL];
  	res.redirect('/urls'); 
  }
  else {
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
  const userID = req.cookies['user_id'];
 
  if(urlDatabase[shortURL]['userID'] === userID) {
  	urlDatabase[shortURL]['longURL'] = longURL;
  }

  res.redirect('/urls');                
});
app.post("/login", (req, res) => {  
  const pw = req.body['password'];
  const email = req.body['emailAddress'];

  let userID = getEmail(users , email);
  if(!checkEmail(users , email) && checkPW(users , pw)) {
  	res.cookie('user_id' , userID);
  	res.redirect('/urls');
  }
  else {
  	res.status(400).send('Invalid email / password'); 
  	}                
});
app.post("/logout", (req, res) => {
  res.clearCookie('user_id');
  res.status(200).redirect('/urls');               
});
app.post("/register", (req, res) => {
	const test = req.body.emailAddress;
	const password = req.body['password'];
	const hashedPassword = bcrypt.hashSync(password, 10);

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

