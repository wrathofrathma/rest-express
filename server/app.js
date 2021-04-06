import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import indexRouter from './routes/index';
import authRouter from './routes/auth';
import userRouter from './routes/users';
import tweetRouter from './routes/tweets';

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

app.use('/', indexRouter);
app.use('/users', userRouter);
app.use('/auth', authRouter);
app.use('/tweets', tweetRouter);

export default app;