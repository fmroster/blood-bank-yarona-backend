import mongoose from 'mongoose';
require('dotenv').config();

export const databaseStartup = async () =>
  mongoose
    .connect(
      `mongodb+srv://bw_ghost:${process.env.DATABASE_PASSWORD}@yarona-blood.3bdiapb.mongodb.net/yarona-api?retryWrites=true&w=majority&appName=yarona-blood`
    )
    .then(() => {
      console.log('Connected to MongoDB');
    })
    .catch((err) => {
      console.error('Error connecting to MongoDB:', err);
    });
