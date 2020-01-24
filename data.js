// data.js
const urlDatabase = {
  userRandomID: {
    longURL: "https://www.tsn.ca",
    userID: "userRandomID"
  },
  userRandomID2: {
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
};

const secretKeys = ['secret', 'terces'];
module.exports = { urlDatabase , users , secretKeys };