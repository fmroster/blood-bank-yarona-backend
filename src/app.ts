import express, { Request, Response, NextFunction } from 'express';
import { startApp } from './helpers/startup/startup.service';
import { errorHandler } from './middleware/error-handler.middleware';

const app = startApp();

app.get('/', (req: Request, res: Response) => {
  res.send('Yarona!!!!');
});

// global error handler
app.use(errorHandler);

const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running on port ${PORT}`);
});
