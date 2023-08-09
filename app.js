const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');

const app = express();
const PORT = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/user_database', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const User = mongoose.model('User', {
  first_name: String,
  last_name: String,
  age: Number,
  gender: String,
  email: String,
  phone: String,
  birth_date: String
});

 User.create({
    first_name: "Vishal",
    last_name: "Mangla",
    age: 10,
    gender: "Male",
    email: "xyz@gmail.com",
    phone: "1234",
    birth_date: "21-03"

  })
  User.create({
    first_name: "Vis",
    last_name: "Mangla",
    age: 10,
    gender: "Male",
    email: "xz@gmail.com",
    phone: "124",
    birth_date: "22-03"

  })


app.get('/api/users', async (req, res) => {
  const first_name = req.query.first_name;

 
  
  const matchingUsers = await User.find({ first_name: new RegExp('^' + first_name) });

  if (matchingUsers.length > 0) {
    res.json(matchingUsers);
  } else {
    try {
      const dummyResponse = await axios.get(`https://dummyjson.com/users/search?q=${first_name}`);
      const dummyUsers = dummyResponse.data;
      console.log(dummyUsers);
      const newUsers = await User.insertMany(dummyUsers);
     res.json({
        users: newUsers,
        total: newUsers.length,
        skip: 0, // Adjust this based on your pagination logic
        limit: 0 // Adjust this based on your pagination logic
      });
      
     
    } catch (error) {
      res.status(500).json({ error: 'An error occurred.' });
    }
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
