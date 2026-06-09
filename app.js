require('dotenv').config();
const express = require('express')
const path = require('path')
const xssClean = require('xss-clean')
const mongoSanitize = require('express-mongo-sanitize');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const logger = require('./src/utils/logger');

// Pending errorHandler
const app = express();
if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1);
}

if(process.env.NODE_ENV != 'production'){
    app.use((req,res,next)=>{
        logger.debug(`${req.files} ${req.baseUrl}`);
        next();
    })
}

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Helmet Integration Pending

app.use(express.json());
app.use(express.urlencoded({extended : true, limit : '10kb'}));


app.use(mongoSanitize());
app.use(xssClean());
app.use(cookieParser(process.env.COOKIE_SECRET));

const globalLimiter = rateLimit({
    windowMs : parseInt(process.env.RATE_LIMIT_WINDOW_MS,10) || 15 * 60 * 1000,
    max : parseInt(process.env.RATE_LIMIT_MAX,10)|| 100,
    standardHeaders:true,
    legacyHeaders : false,
    message : {status: 'fail', message : 'Too many requests. Please try again'}
})

//Pending errorHandler.

module.exports = app;