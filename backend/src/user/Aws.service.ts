import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import { AwsConfig } from '../config/aws.configType';
import crypto from 'crypto';
@Injectable()
export class AwsKmsService {
  private readonly kms: AWS.KMS;

  constructor(private readonly configService: ConfigService<AwsConfig>) {
    AWS.config.update({
      region: 'ap-south-1',
    });
    this.kms = new AWS.KMS();
  }

  private encryptAES(data: string, key: Buffer, iv: Buffer): string {
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(data, 'utf-8', 'base64');
    encrypted += cipher.final('base64');
    return encrypted;
  }

  private decryptAES(encryptedData: string, key: Buffer, iv: Buffer): string {
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(encryptedData, 'base64', 'utf-8');
    decrypted += decipher.final('utf-8');
    return decrypted;
  }

  private generateRandomIV(): Buffer {
    return crypto.randomBytes(16);
  }

  //generate Key
  private generateDataKeyNew(
    keyId: string,
  ): Promise<{ plaintextKey: Buffer; ciphertextKey: Buffer }> {
    return new Promise((resolve, reject) => {
      const generateDataKeyParams: AWS.KMS.GenerateDataKeyRequest = {
        KeyId: process.env.KEY_ID,
        KeySpec: process.env.ALGORITHM_SPEC,
      };

      this.kms.generateDataKey(generateDataKeyParams, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve({
            plaintextKey: data.Plaintext!,
            ciphertextKey: data.CiphertextBlob!,
          });
        }
      });
    });
  }

  //Encrypt Data
  async encryptData(plaintextData: string): Promise<any> {
    try {
      console.log(plaintextData, process.env.KEY_ID);
      const dataKey = await this.generateDataKeyNew(process.env.KEY_ID);
      const dek = dataKey.plaintextKey;
      const encryptedDataKey = dataKey.ciphertextKey;

      const iv = this.generateRandomIV();

      const encryptedData = this.encryptAES(plaintextData, dek, iv);

      const encrpytedDataKey = encryptedDataKey.toString('base64');
      const intialVector = iv.toString('base64');

      // Return or store the encrypted data as needed
      return { encryptedData, encrpytedDataKey, intialVector };
    } catch (error) {
      console.error('Error:', error);
      throw new Error('Failed to encrypt data');
    }
  }

  d;
  //Decyrpt Data
  async decryptData(
    encryptedData: string,
    encryptedDataKey: string,
    iv: string,
  ): Promise<string> {
    try {
      // Decrypt Data Encryption Key (DEK) using AWS KMS
      const dek = await this.decryptDataKey(encryptedDataKey);

      // Decrypt the data using DEK
      const decryptedData = this.decryptAES(
        encryptedData,
        dek,
        Buffer.from(iv, 'base64'),
      );

      console.log('Decrypted Data:', decryptedData);
      return decryptedData;
    } catch (error) {
      console.error('Error:', error);
      throw new Error('Failed to decrypt data');
    }
  }

  private decryptDataKey(encryptedDataKey: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const decryptDataKeyParams: AWS.KMS.DecryptRequest = {
        CiphertextBlob: Buffer.from(encryptedDataKey, 'base64'),
      };

      this.kms.decrypt(decryptDataKeyParams, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data.Plaintext);
        }
      });
    });
  }

  //old Code
  // async generateDataKey(keyId: string): Promise<{ plaintextKey: string; encryptedKey: string }> {
  //   const params: AWS.KMS.GenerateDataKeyRequest = {
  //     KeyId: this.configService.get('keyId', {
  //       infer: true,
  //     }) || process.env.KEY_ID,
  //     KeySpec: this.configService.get('algorithmspec') || process.env.ALGORITHM_SPEC, // You can specify the desired key spec
  //   };

  //   try {
  //     const data = await this.kms.generateDataKey(params).promise();

  //     const plaintextKey = data.Plaintext.toString('base64');
  //     const encryptedKey = data.CiphertextBlob.toString('base64');

  //     return { plaintextKey, encryptedKey };
  //   } catch (error) {
  //     console.error('Error generating data key:', error);
  //     throw new Error('Failed to generate data key');
  //   }
  // }

  // async encryptData(data: string): Promise<string> {
  //   console.log(process.env.KEY_ID);
  //   const { plaintextKey } = await this.generateDataKey(process.env.KEY_ID);
  //   const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(plaintextKey, 'base64'), Buffer.alloc(16, 0));
  //   let encryptedData = cipher.update(data, 'utf-8', 'base64');
  //   encryptedData += cipher.final('base64');

  //   return encryptedData;
  // }

  // async decryptData(encryptedData: string): Promise<string> {
  //   const { encryptedKey } = await this.generateDataKey(process.env.KEY_ID);

  //   const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(encryptedKey, 'base64'), Buffer.alloc(16, 0));
  //   let decryptedData = decipher.update(encryptedData, 'base64', 'utf-8');
  //   decryptedData += decipher.final('utf-8');

  //   return decryptedData;
  // }
}
