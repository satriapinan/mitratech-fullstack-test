const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const cors = require('cors');
const taskRoutes = require('./routes/taskRoutes');
const errorHandler = require('./middlewares/errorMiddleware');
const app = express();

app.use(helmet());

app.use(cors());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests, please try again later.',
});
app.use(limiter);

app.use(xss());

app.use(morgan('dev'));

app.use(express.json());

app.use('/api', taskRoutes);

app.use((req, res, next) => {
    res.status(404).json({
        statusCode: 404,
        message: 'API not found',
        data: null,
    });
});

app.use(errorHandler);

module.exports = app;
