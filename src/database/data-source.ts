import 'reflect-metadata';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '..', '.env') });

import { DataSource } from 'typeorm';
import entities from './entities';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 9001),
  username: process.env.DB_USER || 'relaybox_user',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'relaybox_core_platform',
  synchronize: true,
  logging: false,
  entities
});
