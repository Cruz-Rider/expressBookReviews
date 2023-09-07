const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doexist = (username) => {
    let userwithsamename = users.filter((user) => user.username === username);
    if(userwithsamename.length > 0 ){
        return true;
    } else { return false; }
} 


public_users.post("/register", (req,res) => {
  let username = req.body.username;
  let password = req.body.password;

  if(username && password){
    if(!doexist(username)){
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
        return res.status(404).json({message:"User already exists!"})
    }
  } else {
      return res.status(404).json({message:"Unable to register user!"});
  }

});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify({books},null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  let book = books[isbn];
  res.send(book);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  let filtered_books = {};
  
  for (const i in books){
    if (books.hasOwnProperty(i)) {
        const book = books[i];
        if (book.author === author) {
          filtered_books[i] = book;
        }
      }
    }
  
  res.send(filtered_books);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  let filtered_books = {};

  for(const i in books){
      if(books.hasOwnProperty(i)){
          const book = books[i];
          if(book.title === title){
              filtered_books[i] = book;
          }
      }
  }

  res.send(filtered_books);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  let review = books[isbn].reviews;
  
  res.send(review);
});

module.exports.general = public_users;
