import { registerAs } from '@nestjs/config';
import { AppConfigType } from './appConfigType';
import validateConfig from '.././utils/validate-config';
import {
    IS_ALPHA,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
} from 'class-validator';
import { AwsConfig } from './aws.configType';



class EnvironmentVariablesValidator {
  @IsString()
  ACCCES_KEY_ID: string;
  
  @IsString()
  SECRET_ACCESS_KEY: string

  @IsString()
  KEY_ID:string
  
  @IsString()
  ALGORITHM_SPEC:string

}

export default registerAs<AwsConfig>('aws', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    accessKeyId: process.env.ACCCES_KEY_ID  ,
    secretAccessKey: process.env.SECRET_ACCESS_KEY ,
    algorithmspec: process.env.KEY_ID,
    keyId: process.env.ALGORITHM_SPEC
  };
});
