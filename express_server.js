// expresS_server.js

const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
app.set("view engine", "ejs");

const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());


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

};


// ============================== GET REQUESTS ================================= //

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

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


//res.status(400).send('you are already logged in');
// return Object.keys(object).find(key => object[key] === value);








// ================================== LISTEN ===================================== //

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

