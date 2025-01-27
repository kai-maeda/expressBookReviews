const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!isValid(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  new Promise((resolve, reject) => {
    if (books) {
        resolve(books);
    } else {
        reject({ message: "Books data not available" });
    }
})
.then(data => res.status(200).json(data))
.catch(error => res.status(500).json(error));
});
  

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;

    new Promise((resolve, reject) => {
        if (books[isbn]) {
            resolve(books[isbn]); // Resolve if book is found
        } else {
            reject({ message: "Book not found" }); // Reject if book does not exist
        }
    })
    .then(data => res.status(200).json(data))
    .catch(error => res.status(404).json(error));
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author
  new Promise((resolve, reject) => {
    const filtered_books = Object.values(books).filter((book) => book.author === author);
    if (filtered_books > 0) {
        resolve(filtered_books); // Resolve if book is found
    } else {
        reject({ message: "No books found for this author" }); // Reject if book does not exist
    }
})
.then(data => res.status(200).json(data))
.catch(error => res.status(404).json(error));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title
  new Promise((resolve, reject) => {
    const filtered_books = Object.values(books).filter((book) => book.title === title);
    if (filtered_books > 0) {
        resolve(filtered_books); // Resolve if book is found
    } else {
        reject({ message: "No books found for this title" }); // Reject if book does not exist
    }
})
.then(data => res.status(200).json(data))
.catch(error => res.status(404).json(error));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  res.send(books[isbn].reviews);
});

module.exports.general = public_users;
