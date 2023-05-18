import { connect as mongooseConnect, connection } from 'mongoose';

const dbConfig = process.env.MONGO_URL as string;

export const connect = async (): Promise<void> => {
  await mongooseConnect(dbConfig);
};

export const close = (): Promise<void> => connection.close();
