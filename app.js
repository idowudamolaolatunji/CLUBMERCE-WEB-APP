const path = require('path');
////////////////////////////////////////////////////

const express = require('express');
const morgan = require('morgan');
// const helmet = require('helmet');
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
const authController = require('./controller/authcontroller');
const affiliateLinkController = require('./controller/affiliateLinkController')
const subscriptionController = require('./controller/subscriptionController')

const app = express();
const io = require('socket.io')(require('http').createServer(app));

// body parser and cookie parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(bodyParser.json({limit: "100mb"}));
app.use(bodyParser.json());
app.use(cookieParser());
  
// Use the 'cors' middleware to enable CORS for all routes
// app.use(cors());


// pug
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(morgan('dev'));


// Set security http headers
// app.use(helmet())
// helmet.contentSecurityPolicy({
//   useDefaults: false,
//   directives: {
//     defaultSrc: ["'self'"],
//     scriptSrc: ["'self'", "example.com"], // scripts from example.com are now trusted
//     objectSrc: ["'none'"],
//     upgradeInsecureRequests: [],
//   },
// })

// Rate limiting
// const limiter = rateLimit({
//     max: 500,
//     windowMs: 60 * 60 * 1000,
//     message: 'Too many request from this IP, please try again in an hour!'
// })
// app.use('/', limiter)

// Data sanitization agains NoSql query injestion
// app.use(mongoSanitize());

// Data sanitization agains xss
// app.use(xss())

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    // console.log(req.headers);
    // console.log(req.params)
    console.log('Hello from the Middleware...');
    next();
});
///////////////////////////////////////////////////////
app.use('/', viewsRouter)
app.get('/unique_/:userSlug/:productSlug', affiliateLinkController.countClicksRedirects);
app.get('/api/subscribe/payment-verification/:reference', authController.isLoggedIn,  subscriptionController.verifyPaystackPayment);
// app.get('/api/boost/payment-verification/:reference', subscriptionController.verifyPaystackPayment);


app.use('/api/products', productsRouter);
app.use('/api/users', usersRouter);
app.use('/api/promotion', affiliateLinkRouter);
app.use('/api/transactions', transactionRouter);
app.use('/api/orders', ordersRouter);

module.exports = app;

// const randomId = crypto.randomInt(100000, 999999).toString();
