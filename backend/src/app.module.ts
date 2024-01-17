import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import appConfig from './config/app.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user/entities/user.entity';
import { CryptoModuleModule } from './crypto-module/crypto-module.module';
import helmet from 'helmet';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot([{
      name:"Global",
      ttl: 6000,
      limit: 10,
    }]),
    TypeOrmModule.forRoot({
      type: 'mssql',
      host: 'localhost',
      port: 1434,
      username: 'sa',
      password: 'qwertyuiop',
      database: 'prayatna',
      entities: [UserEntity],
      options: {
        encrypt: false, // MSSQL-specific option
      },
      synchronize: true, //use this with development environment
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
      envFilePath: ['.env'],
    }),
    UserModule,
    CryptoModuleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(helmet()).forRoutes('*');
  }
}
