import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import appConfig from './config/app.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user/entities/user.entity';
import helmet from 'helmet';
import { ThrottlerModule } from '@nestjs/throttler';
import awsConfig from './config/Aws.config';
import { CreditCardEntity } from './user/entities/card.entity';
import { FileLogger } from 'typeorm';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        name: 'Global',
        ttl: 6000,
        limit: 10,
      },
    ]),
    TypeOrmModule.forRoot({
      type: 'mssql',
      host: 'localhost',
      port: 1434,
      username: 'sa',
      password: 'qwertyuiop',
      database: 'Prayatna',
      entities: [UserEntity, CreditCardEntity],
      options: {
        encrypt: false, // MSSQL-specific option
      },
      synchronize: true, //use this with development environment
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: false,
      ignoreEnvVars: false,
      load: [appConfig, awsConfig],
      envFilePath: ['.env'],
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService,    { provide: Logger, useClass: FileLogger },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(helmet()).forRoutes('*');
  }
}
