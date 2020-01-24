const getUserByEmail = function(object , email) {
  let result = undefined;
  Object.keys(object).forEach(val => {
    if (object[val]['email'] === email) {
      result = val;
      return result;
    }
  });

  return result;
};

const generateRandomString = function() {
  let chars = "123456789abcdefghiklmnopqrstuvwxyz";
  let stringLength = 6;
  let randomstring = '';
  for (let i = 0; i < stringLength; i++) {
    let rnum = Math.floor(Math.random() * chars.length);
    randomstring += chars.substring(rnum,rnum + 1);
  }
  return randomstring;
};

const checkEmail = function(object , email) {
  for (const key of Object.keys(object)) {
    if (object[key]['email'] === email) {
      return false;
    }
  }
  return true;
};

const checkPW = function(object , pw) {
  let result = 0;
  Object.keys(object).forEach(val => {
    if (object[val]['password'] === pw) {
      result = 1;
      return result;
    }
  });

  return result;
};

const getPW = function(users , email) {
  for (const key of Object.keys(users)) {
    if (users[key]['email'] === email) {
      return users[key]['password'];
    }
  }
  return undefined;
};

const urlsForUser = function(urlDatabase , id) {
  let result = [];
  Object.keys(urlDatabase).forEach(key => {
    if (urlDatabase[key]['userID'] === id) {
      let urls = {};
      urls['shortURL'] = key;
      urls['longURL'] = urlDatabase[key]['longURL'];
      result.push(urls);
    }
  });
  return result;
};

module.exports = { getUserByEmail , generateRandomString , checkEmail , checkPW , getPW , urlsForUser};