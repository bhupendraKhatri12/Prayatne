import { Injectable, NotFoundException, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { successMessage, errorMessage } from '../utils/response';
import {
  SuccessMessageResponse,
  ErrorMessageResponse,
} from '../utils/response';
import { CreditCardEntity } from './entities/card.entity';
import { AwsKmsService } from './Aws.service';
import { UserInfo } from './interfaces/userInfo.interface';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(CreditCardEntity)
    private readonly creditCardRepository: Repository<CreditCardEntity>,
    private readonly AwsKmsService: AwsKmsService,
    private dataSource: DataSource,
  ) {}

  async create(
    createUserDto: CreateUserDto,
  ): Promise<SuccessMessageResponse<UserInfo> | ErrorMessageResponse> {
    try {
      const { name, email, creditCardNumber } = createUserDto;
      // Create a new user
      const newUser = new UserEntity();
      newUser.name = name;
      newUser.email = email;

      //Create a new CreditCard
      const newCreditCard = new CreditCardEntity();
      newCreditCard.creditCardNumber = creditCardNumber;

      //Encrypting the Credit Card
      // Encrypt the credit card number
      let encryptedResponse;
      try {
        encryptedResponse =
          await this.AwsKmsService.encryptData(creditCardNumber);
      } catch (error) {
        throw new Error('Error encrypting credit card data');
      }

      newCreditCard.encrpytedDataKey = encryptedResponse.encrpytedDataKey;
      newCreditCard.creditCardNumber = encryptedResponse.encryptedData;
      newCreditCard.intialVector = encryptedResponse.intialVector;
      const saveCreditCard =
        await this.creditCardRepository.save(newCreditCard);

      //saving the credit card details
      newUser.creditCard = saveCreditCard;
      const savedUser = await this.userRepository.save(newUser);

      const returnedData = {
        name: savedUser.name,
        email: savedUser.email,
        creditCardNumber: savedUser.creditCard.creditCardNumber,
      };

      return successMessage('Creates a new user', returnedData);
    } catch (error) {
      return errorMessage('Error creating user', error);
    }
  }

  async findAll(): Promise<
    SuccessMessageResponse<UserEntity[]> | ErrorMessageResponse
  > {
    return successMessage(
      'All Users',
      await this.userRepository.find({ relations: ['creditCard'] }),
    );
  }

  async findOne(
    email: string,
  ): Promise<SuccessMessageResponse<UserInfo> | ErrorMessageResponse> {
    try {
      const user = await this.userRepository.findOne({
        where: { email: email },
        relations: ['creditCard'],
      });

      const creditCardNumber = user.creditCard.creditCardNumber;
      const intialVector = user.creditCard.intialVector;
      const encrpytedDataKey = user.creditCard.encrpytedDataKey;

      const decrytpedCard = await this.AwsKmsService.decryptData(
        creditCardNumber,
        encrpytedDataKey,
        intialVector,
      );

      const returnedData = {
        name: user.name,
        email: user.email,
        creditCardNumber: decrytpedCard,
      };

      return successMessage('User', returnedData);
    } catch (error) {
      throw errorMessage(`User with Email ${email} not found`, error);
    }
  }

  async remove(
    id: number,
  ): Promise<SuccessMessageResponse<UserEntity> | ErrorMessageResponse> {
    const user = await this.userRepository.findOne({ id: id });
    return successMessage('User removed', user);
  }
}
