const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({path: './config.env'});
const app = require('./app');

const DB = process.env.CLUBMERCE_DB.replace('<PASSWORD>', process.env.CLUBMERCE_DB_PASSWORD);

mongoose.connect(DB)
.then(con => {
    console.log('Db connection successful!');
}).catch(err => {
    console.log(err);
});

const port = process.env.PORT || 8000;

app.listen(port, process.env.HOST, () => {
    console.log(`App running on port ${port}...`);
});