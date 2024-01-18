import { Injectable, NotFoundException, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import {  successMessage, errorMessage } from '../utils/response';
import {SuccessMessageResponse,ErrorMessageResponse} from "../utils/response"
import { CryptoModuleService } from '../crypto-module/crypto-module.service';
import { CreditCardEntity } from './entities/card.entity';
import { AwsKmsService } from '../crypto-module/Aws.service';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(CreditCardEntity)
    private readonly creditCardRepository:Repository<CreditCardEntity>,
    private readonly AwsKmsService :AwsKmsService
  ) {}

  async create(createUserDto: CreateUserDto): Promise<SuccessMessageResponse<UserEntity> |ErrorMessageResponse> {
    try {
      const { name, email, creditCardNumber } = createUserDto;
      // Create a new user entity
      const newUser = new UserEntity();
      newUser.name = name;
      newUser.email = email;
  
      // Create a new credit card entity
      const newCreditCard = new CreditCardEntity();
      newCreditCard.creditCardNumber = creditCardNumber;
      
      const excryptedResponse =  await this.AwsKmsService.encryptData(creditCardNumber)
      newCreditCard.encrpytedDataKey = excryptedResponse.encrpytedDataKey;
      newCreditCard.creditCardNumber = excryptedResponse.encryptedData;
      newCreditCard.intialVector =  excryptedResponse.intialVector;
      const saveCreditCard  =await  this.creditCardRepository.save(newCreditCard)
      
       //saving the credit card details

           newUser.creditCard = saveCreditCard

      const savedUser = await this.userRepository.save(newUser);
  
      return successMessage('Creates a new user', savedUser);
    } catch (error) {
      return errorMessage('Error creating user', error);
    }
  }
  

  async findAll(): Promise<SuccessMessageResponse<UserEntity[]>| ErrorMessageResponse> {


    return successMessage('All Users', await this.userRepository.find({relations:["creditCard"]}));
  }

  async findOne(email: string): Promise<SuccessMessageResponse<any>| ErrorMessageResponse> {
    try {
      let user = await this.userRepository.findOne({ where: { email: email },relations:['creditCard'] });
      
      const creditCardNumber = user.creditCard.creditCardNumber;
      const intialVector   =  user.creditCard.intialVector;
      const encrpytedDataKey =  user.creditCard.encrpytedDataKey;

       const decrytpedCard =  await this.AwsKmsService.decryptData(creditCardNumber,encrpytedDataKey,intialVector)
          
       const returnedData =  {name:user.name,email:user.email,creditCardNumber:decrytpedCard}
         
      return successMessage('User',returnedData);
    } catch (error) {
      throw  errorMessage(`User with Email ${email} not found`, error);
    }
  }


  async remove(id: number): Promise<SuccessMessageResponse<UserEntity>|ErrorMessageResponse> {
    const user = await this.findOne(id);
    return successMessage('User removed', user);
  }
}
