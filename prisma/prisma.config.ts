import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(__dirname, '.env') });

export default {
  schema: './prisma/schema.prisma', 
  datasources: {
    db: {
      provider: 'mysql',
      url: process.env.DATABASE_URL as string, 
    },
  },
};