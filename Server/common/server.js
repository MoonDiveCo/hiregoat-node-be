import express from 'express';
import mongoose from 'mongoose';
import * as http from 'http';
import cors from 'cors';
import * as path from 'path';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import apiErrorHandler from '../helper/apiErrorHandler';
import userRouter from '../api/v1/controllers/user/routes';
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

  configureSwagger(swaggerDefinition) {
    const options = {
      // swaggerOptions : { authAction :{JWT :{name:"JWT", schema :{ type:"apiKey", in:"header", name:"Authorization", description:""}, value:"Bearer <JWT>"}}},
      swaggerDefinition,
      apis: [
        path.resolve(`${root}/server/api/v1/controllers/**/*.js`),
        path.resolve(`${root}/api.yaml`),
      ],
    };

    app.use(
      '/api-docs',
      swaggerUi.serve,
      swaggerUi.setup(swaggerJSDoc(options))
    );
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
