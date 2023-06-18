const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const pug = require('pug');
const helmet = require('helmet')
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean')
/////////////////////////////////////////////////////

const productsRouter = require('./routes/productsRoutes');
const usersRouter = require('./routes/usersRoute');
const viewsRouter = require('./routes/viewsRoutes');

dotenv.config({path: './config.env'});
const app = express();

// Set security http headers
app.use(helmet())

// pug
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));


if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Rate limiting
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many request from this IP, please try again in an hour!'
})
app.use('/', limiter)

// body parser
app.use(express.json());

// Data sanitization agains NoSql query injestion
app.use(mongoSanitize());

// Data sanitization agains xss
app.use(xss())

app.use(express.static(path.join(__dirname, 'public')));

/////////////////////////
app.use((req, res, next) => {
    // console.log(req.headers);
    console.log('Hello from the Middleware...');
    next();
});
///////////////////////////////////////////////////////
app.use('/', viewsRouter)
app.use('/api/products', productsRouter);
app.use('/api/users', usersRouter);

module.exports = app;

