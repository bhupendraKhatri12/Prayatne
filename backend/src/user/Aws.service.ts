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
  ): Promise<{ plaintextKey: any; ciphertextKey: any }> {
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

      return decryptedData;
    } catch (error) {
      console.error('Error:', error);
      throw new Error('Failed to decrypt data');
    }
  }

  private decryptDataKey(encryptedDataKey: string): Promise<any> {
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
}
