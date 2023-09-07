const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  let username = req.body.username;
  let password = req.body.password;

  if(username && password){
    if(!isValid(username)){
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
        return res.status(404).json({message:"User already exists!"})
    }
  } else {
      return res.status(404).json({message:"Unable to register user!"});
  }

});

// Get the book list available in the shop using async/await with Axios
public_users.get('/', async function (req, res) {
  try {
    const response = await axios.get('http://localhost:5000/books'); 
    const booksData = response.data;
    res.send(JSON.stringify({ books: booksData }, null, 4));
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Get book details based on ISBN using async/await with Axios
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  try {
    const response = await axios.get(`http://localhost:5000/books/isbn/${isbn}`); 
    const bookData = response.data;
    res.send(bookData);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Get book details based on author using async/await with Axios
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
    const response = await axios.get(`http://localhost:5000/books/author/${author}`); 
    const booksData = response.data;
    res.send(booksData);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Get all books based on title using async/await with Axios
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;
  try {
    const response = await axios.get(`http://localhost:5000/books/title/${title}`); 
    const booksData = response.data;
    res.send(booksData);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  let review = books[isbn].reviews;
  
  res.send(review);
});

module.exports.general = public_users;
