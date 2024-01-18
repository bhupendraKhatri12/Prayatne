import { Injectable } from '@nestjs/common';
import { createCipheriv, createDecipheriv, randomBytes, scrypt, scryptSync } from 'crypto';

@Injectable()
export class CryptoModuleService {
   constructor()
   {

   }
    private readonly algorithm = 'aes-256-cbc';
    private key: Buffer;
    private iv: Buffer;
  
   async setSecretKey(secretKey: string): Promise<void> {
      // Derive a key and initialization vector from the provided secret key
      try{ 
          this.key = scryptSync(secretKey, 'salt', 32)

        //   scryptA(secretKey, 'salt', 32, (err, derivedKey) => {
 
        //     if (err) throw err;
        //     console.log("Dervied",derivedKey)
            
        //     // Prints derived key as buffer
        //     this.key =derivedKey
        //  });

         
          this.iv = randomBytes(16);
      }catch(e)
      {
        throw e;
      }
    
    }
  
  async  encrypt(data: string,secertKey:string): Promise<string> {

      this.setSecretKey(secertKey);
      if (!this.key || !this.iv) {
        throw new Error('Secret key is not set. Call setSecretKey() before encrypting.');
      }
  
      const cipher = createCipheriv(this.algorithm, this.key,this.iv);
      let encrypted = cipher.update(data, 'utf-8', 'hex');
      encrypted += cipher.final('hex');
      return encrypted;
    }
  
  async  decrypt(data: string): Promise<string> {
    if (!this.key || !this.iv) {
        throw new Error('Secret key is not set. Call setSecretKey() before decrypting.');
      }
  
      try {
        // const [iv, encryptedData] = data.split(':');
        console.log(this.iv);
        const decipher = createDecipheriv(this.algorithm, this.key, this.iv);
        let decrypted = decipher.update(data, 'hex', 'utf-8');
        decrypted += decipher.final('utf-8');
        return decrypted;
      } catch (error) {
        console.error('Error decrypting data:', error.message);
        throw new Error('Failed to decrypt data. Check the input format.');
      }
    }

}
