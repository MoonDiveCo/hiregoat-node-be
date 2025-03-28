import express from 'express';
import mongoose from 'mongoose';
import * as http from 'http';
import cors from 'cors';
import * as path from 'path';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import apiErrorHandler from '../helper/apiErrorHandler';
const app = express();

const server = http.createServer(app);
const root = path.normalize(`${__dirname}/../..`);

class ExpressServer {
  constructor() {
    app.use(express.json({ limit: '1000mb' }));
    app.use(express.urlencoded({ extended: true, limit: '1000mb' }));
    app.use(morgan('dev'));
    app.set('trust proxy', 1);
    app.use(cookieParser());

    app.use(cors());
    const corsOptions = {
      origin: 'http://localhost:3000', 
      methods: 'GET,POST,PUT,DELETE,OPTIONS',
      allowedHeaders: 'Content-Type, Authorization, token',
      exposedHeaders: 'Authorization, token',
      credentials: true,
      preflightContinue: false,
    };
    app.use(cors(corsOptions));
  }

  router(routes) {
    routes(app);
    return this;
  }

  handleError() {
    app.use(apiErrorHandler);
    return this;
  }

  async configureDb(dbUrl) {
    try {
      await mongoose.connect(dbUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('MongoDB connection established🌍');
      return this;
    } catch (err) {
      console.error(`Error in MongoDB connection: ${err.message}`);
      throw err;
    }
  }

  listen(port) {
    server.listen(port, () => {
      console.log(
        `Server is running on port: ${port}`,
        new Date().toLocaleString()
      );
    });
    return app;
  }
}
export default ExpressServer;
