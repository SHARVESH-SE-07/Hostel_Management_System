import mongoose from 'mongoose';
export const connectDb = () => mongoose.connect(process.env.MONGODB_URI).then(() => console.log('MongoDB connected'));
