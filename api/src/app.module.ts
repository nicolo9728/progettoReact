import { Module } from '@nestjs/common';
import { LibriController } from './controllers/libri.controller';
import { QueryExecutor } from './database/queries/queryExecutor';
import { GetLibriQuery } from './database/queries/getLibriQuery';
import { DatabaseModule } from './database.module';
import { ConfigModule } from '@nestjs/config';
import { StorageService } from './services/storageService';
import { AuthModule } from './auth/auth.module';
import { GetLibroByIsbnQuery } from './database/queries/getLibroByIsbnQuery';
import { PrestitoController } from './controllers/prestito.controller';

@Module({
  imports: [DatabaseModule, ConfigModule.forRoot({ isGlobal: true }), AuthModule],
  controllers: [LibriController, PrestitoController],
  providers: [QueryExecutor, GetLibroByIsbnQuery, GetLibriQuery ,StorageService],
})
export class AppModule { }
