const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', err => {
    console.log(err.name, err.message);
    console.log('uncaught expection :( shutting down...');
    process.exit(1);
})

dotenv.config({
    path: './config.env'
});
const app = require('./app');


mongoose
    .connect(process.env.DATABASE_LOCAL, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false
    })
    .then(con => console.log('DB connection successful!'));


const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log(`App running on ${port}...`);
});

process.on('unhandledRejection', err => {
    console.log(err.name, err.message);
    console.log('unhandled Rejection :( shutting down...');
    server.close(() => {
        process.exit(1);
    });
});