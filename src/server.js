const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', err => {
    console.log('An Error occured - UNCAUGHT EXCEPTION ERROR');
    const error = {
        name: err.name,
        message: err.message,
        stack: err.stack
        // stack: err.stack
        //     .split('\n')[0]
        //     .trim()
        //     .replace('Object.<anonymous> ', '')
    };
    console.log('ERROR =', error);

    process.exit(1);
});

dotenv.config({ path: './config.env' });

const DB = process.env.DB_LOCAL;
// const DB = process.env.DB_AUTH_LOCAL.replace(
//     '<username>',
//     process.env.DB_USERNAME
// ).replace('<password>', process.env.DB_PASSWORD);
console.log(DB);
mongoose
    .connect(DB, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then(() => {
        console.log('DATABASE CONNECTION IS SUCCESSFUL');
    })
    .catch(err => {
        console.log(
            'DATABASE CONNECTION FAILED --- ERROR CONNECTING TO DATABASE',
            err
        );
    });

const app = require('./app');

const port = process.env.SERVER_PORT || 3000;

const server = app.listen(port, () => {
    console.log(`LISTENING TO SERVER http://127.0.0.1:${port} ON PORT ${port}`);
});

process.on('unhandledRejection', err => {
    console.log('An Error occured - UNHANDLED REJECTION ERROR');
    const error = {
        name: err.name,
        message: err.message,
        stack: err.stack
    };
    console.log('ERROR =', error);

    server.close(() => {
        process.exit(1);
    });
});
