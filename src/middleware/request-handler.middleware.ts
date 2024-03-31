import { Router } from 'express';

const toAsyncRouter = require('async-express-decorator');
export const CreateRouter = (router: Router = Router()): Router => {
  const methods: string[] = ['get', 'post', 'delete', 'put', 'patch', 'all'];
  // set types of methods affected
  toAsyncRouter.setMethods(methods);

  // create router wrapped with async handler
  return toAsyncRouter(router);
};
