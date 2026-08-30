import { Module, Global } from '@nestjs/common';
import { Pool } from 'pg';
import { ConfigService } from '@nestjs/config';
import { UnitOfWork } from './database/unitOfWork';

@Global()
@Module({
  providers: [
    {
      provide: "DATABASE_POOL",
      inject: [ConfigService],
      useFactory: (conf: ConfigService) => {
        return new Pool({
          connectionString: conf.get<string>("DATABASE_URL")
        });
      },
    },
    UnitOfWork
  ],
  exports: ["DATABASE_POOL", UnitOfWork],
})
export class DatabaseModule {}