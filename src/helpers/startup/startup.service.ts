import express, { Express } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import { databaseStartup } from './database.service';

export const startApp = (): Express => {
  let app: Express = express();

  try {
    app = addMiddleware(app);
  } catch (error) {
    console.log(`${error}`);
  }
  databaseStartup().catch((err) => console.error(err));

  return app;
};
const addMiddleware = (app: Express): Express => {
  app.use(cors({ origin: '*', credentials: true }));
  app.use(bodyParser.json({ limit: '500mb' }));
  app.set('trust proxy', true);
  app.use(
    bodyParser.urlencoded({
      extended: true,
      limit: '500mb',
      parameterLimit: 1000000000
    })
  );
  app.use(helmet());

  return app;
};
