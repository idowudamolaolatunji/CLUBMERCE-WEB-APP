const path = require('path');
////////////////////////////////////////////////////

const express = require('express');
const morgan = require('morgan');
const pug = require('pug');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const cors = require('cors');
/////////////////////////////////////////////////////

const productsRouter = require('./routes/productsRoutes');
const usersRouter = require('./routes/usersRoute');
const viewsRouter = require('./routes/viewsRoutes');
const ordersRouter = require('./routes/ordersRoutes');
const affiliateLinkRouter = require('./routes/affiliateLinkRoutes');
const transactionRouter = require('./routes/transactionRoutes');
const affiliateLinkController = require('./controller/affiliateLinkController')

const app = express();
const io = require('socket.io')(require('http').createServer(app));

// body parser and cookie parser
app.use(express.json());
app.use(cookieParser());


// Set Content Security Policy (CSP) header
app.use((req, res, next) => {
    res.setHeader("Content-Security-Policy", "img-src 'self' data: blob:;");
    next();
});

// Use the 'cors' middleware to enable CORS for all routes
app.use(cors());


// pug
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));


if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Set security http headers
app.use(helmet())

// Rate limiting
// const limiter = rateLimit({
//     max: 500,
//     windowMs: 60 * 60 * 1000,
//     message: 'Too many request from this IP, please try again in an hour!'
// })
// app.use('/', limiter)

// Data sanitization agains NoSql query injestion
app.use(mongoSanitize());

// Data sanitization agains xss
app.use(xss())

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    // console.log(req.headers);
    console.log(req.params)
    console.log('Hello from the Middleware...');
    next();
});
///////////////////////////////////////////////////////
app.use('/', viewsRouter)
app.get('/unique_/:userSlug/:productSlug', affiliateLinkController.countClicksRedirects);

app.use('/api/products', productsRouter);
app.use('/api/users', usersRouter);
app.use('/api/promotion', affiliateLinkRouter);
app.use('/api/transactions', transactionRouter);
app.use('/api/orders', ordersRouter);

module.exports = app;

// const randomId = crypto.randomInt(100000, 999999).toString();
