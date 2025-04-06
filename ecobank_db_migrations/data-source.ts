import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  schema: 'public',
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/ecobank_db_migrations/migrations/*.js'],
  synchronize: false,
  ssl: {
    rejectUnauthorized: false, // untuk Railway
  },
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
