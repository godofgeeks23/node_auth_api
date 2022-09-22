const express = require('express');
const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config()

const app = express();

mongoose.connect(process.env.DB_CONNECT, () => console.log("connected to DB"));

const authroute = require('./routes/auth');

// route middleware
app.use('/api/user', authroute)


app.listen(3000, () => console.log("up and running"));
