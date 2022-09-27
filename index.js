const express = require('express');
const app = express();
const volleyball = require('volleyball');
app.use(volleyball);
const POST = 1337;
const router = require('./router')
app.use('/', router)


app.listen(POST, ()=>{
    console.log('Game on!')
})