import { Controller, Get, Param, Post } from '@nestjs/common';
import { CryptoModuleService } from './crypto-module.service';
import { AwsKmsService } from './Aws.service';
import { ApiTags } from '@nestjs/swagger';
import { SuccessMessageResponse, successMessage } from '../utils/response';

@ApiTags("Crypto")
@Controller('crypto-module')
export class CryptoModuleController {
  constructor(private readonly cryptoModuleService: CryptoModuleService,private readonly awsKmsService: AwsKmsService) {
  }



  @Post("\encrpyt\:data")
  async encrypt(@Param(":data")data:string)
  {
    return await successMessage("Encrypted data",await this.awsKmsService.encryptData("Bhupendra Khatri"))
  }

  @Post("\decrypt\:data")
  async decrypt(@Param(":data")data:string)
  {
    return await successMessage("Encrypted data",await this.awsKmsService.decryptData("rBX1XpSwYVSfTcc1bc8Yw3vnQlKmqwESux2OhdjCkJw=","AQIDAHgplqxD54OwfUakK2G2tP/ouYAo2fpJcanKjJwDRobwzQGq6gyG7IdUEnVLFj78ToWEAAAAfjB8BgkqhkiG9w0BBwagbzBtAgEAMGgGCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQMto6k3mYNEXfurG2RAgEQgDvQePWJGUTPWNpdzIotqo4TuJRVMnehYyYAzifzauX/KSkRQB6ewP44yd5sGjd/K6959p33o5LOT1++ew==","3jCNXfcUahvROTBJuw0DIA=="))
  }


}

