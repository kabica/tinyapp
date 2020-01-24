const { assert } = require('chai');

const { getUserByEmail , checkEmail , getPW , urlsForUser } = require('../helper');

const testUsers = {
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





describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail(testUsers , "user@example.com")
    const expectedOutput = "userRandomID";
 
    assert.equal(user , expectedOutput);
  });

  it('should return undefined if user e-mail does not exist', function() {
    const user = getUserByEmail(testUsers , "notReal@example.com")
    const expectedOutput = undefined;

    assert.equal(user , expectedOutput);
  })
});

describe('checkEmail', function() {
  it('should return false if input email already exists in database', function() {
    const user = checkEmail(testUsers , "user@example.com")
    const expectedOutput = false;
 
    assert.equal(user , expectedOutput);
  });

  it('should return true if input email is unique to database', function() {
    const user = checkEmail(testUsers , "userNot@example.com")
    const expectedOutput = true;
 
    assert.equal(user , expectedOutput);
  });
  
});

describe('getPW', function() {
  it('should return password associated to user email', function() {
    const user = getPW(testUsers , "user@example.com")
    const expectedOutput = 'purple-monkey-dinosaur';
 
    assert.equal(user , expectedOutput);
  });

  it('should return undefined if email invalid', function() {
    const user = getPW(testUsers , "userNot@example.com")
    const expectedOutput = undefined;
 
    assert.equal(user , expectedOutput);
  });

});

describe('urlsForUser', function() {
  it('should return array of shortURL / longURL objects', function() {
    const user = urlsForUser(urlDatabase , 'userRandomID')
    const expectedOutput = [ { shortURL: 'alex', longURL: 'https://www.tsn.ca' },
    { shortURL: 'bica', longURL: 'https://www.google.ca' } ]
 
    assert.deepEqual(user , expectedOutput);
  });

  it('should return empty array if no userID matches are found', function() {
    const user = urlsForUser(urlDatabase , 'userNOTRandomID')
    const expectedOutput = [];
 
    assert.deepEqual(user , expectedOutput);
  });


});

