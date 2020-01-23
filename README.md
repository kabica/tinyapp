# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly). **Voila!** *URL so short, URL so Nice!*

## Final Product

!["Login page / credentials"](#)
!["Index of user-specific URLs"](#)

## Dependencies

- Node.js
- Express
- EJS
- bcrypt
- body-parser
- cookie-session

# Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node express_server.js` command.
- See below for further deatils :) 


## Express Setup

- Initalize NPM  
	- **`npm init -y`** *(-y to accept default)*
- Install Express
	- **`npm install express`**
- Start your server!
	- **`node express_server.js`**

## EJS Setup

- Install EJS as dependency 
	- **`npm install ejs`**
- Set EJS as view engine
	- **`app.set("view engine", "ejs");`**

## Nodemon Setup _*(optional)*_

- Install *Nodemon* 
	- **`npm install --save-dev nodemon`**
- Edit scripts to allow for quick start-up
	- **`"start": "./node_modules/.bin/nodemon -L express_server.js"`**
- Start your server!
	- **`npm start`**

## BCRYPT Setup

- Install *bcrypt* package
	- **`npm install -E bcrypt@2.0.0`** *(check version compatability!)*
- Require *bcrypt* package
	- **`const bcrypt = require('bcrypt');`**

## Cookie-Session Setup

- Install *cookie-session*
	- **`npm install cookie-session`**
- Require *cookie-session*
	- **`const cookieSession = require('cookie-session');`**










