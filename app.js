const express = require('express');
const app =  express();
const productRoutes = require('./api/router/products');
const orderRoutes = require('./api/router/orders');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());



// connect to mongo db, mongoose
// mongoose.connect(
//     'mongodb+srv://jyoti:jyoti@cluster0-0tmqu.mongodb.net/1st_dec_2019?retryWrites=true&w=majority', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// }, () => console.log('connected to mongodb'));

mongoose.connect
('mongodb+srv://jyoti:jyoti123@cluster0-0tmqu.mongodb.net/dec1_2019?retryWrites=true&w=majority',
{useNewUrlParser: true, useUnifiedTopology: true}
);
mongoose.Promise = global.Promise;
// handle CORS - Cross Origin Resource Sharing 
app.use((req, res, next) => {
    res.header('Aceess-Control-Allow-Origin', '*');
    res.header
    ('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if(req.method === 'options'){
        res.header('Acess-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        res.status(200).json({}); // empty as we no need to go anywhere from here so 
    }
    next();
});
// app.use((req, res, next) => {
//     res.status(200).json({
//         "jyoti": "luckie"
//     })
// });

app.use(morgan('dev'));
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

// handling error 
    // app.use((req, res, next)=> {
    //     const error = new Error("File not Found, jyoti");
    //     error.status = 404;
    //     next();
    // });

// app.use((error, req, res, next)=>{

// });
module.exports = app;