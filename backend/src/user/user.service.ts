import { Injectable, NotFoundException, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { DataSource, Repository,  } from 'typeorm';
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

  async create(createUserDto: CreateUserDto): Promise<SuccessMessageResponse<any> | ErrorMessageResponse<void>> {
    try {
      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
  
      try {
        const { name, email, creditCardNumber } = createUserDto;
  
        // Encrypt credit card data first
        const encryptedResponse = await this.AwsKmsService.encryptData(creditCardNumber);
        if (!encryptedResponse.encrpytedDataKey || !encryptedResponse.encryptedData || !encryptedResponse.intialVector) {
          return errorMessage("Failed to encrypt data", "data encryption");
        }
  
        
        
        // Create credit card entity
        const savedCreditCard = await queryRunner.manager.save(queryRunner.manager.create(CreditCardEntity, {
          encrpytedDataKey: encryptedResponse.encrpytedDataKey,
          creditCardNumber: encryptedResponse.encryptedData,
          intialVector: encryptedResponse.intialVector,
        }));
        
        // Create user entity (without credit card reference)
        const savedUser = await queryRunner.manager.save(queryRunner.manager.create(UserEntity, { name, email,creditCard: savedCreditCard }));
        // Establish the relationship between the user and credit card
        savedUser.creditCard = savedCreditCard; // Assign the credit card
  
        await queryRunner.commitTransaction();
  
        const returnedData = {
          name: savedUser.name,
          email: savedUser.email,
        }; // creditCardNumber is not returned as it's sensitive
  
        return successMessage('Creates a new user', returnedData);
      } catch (error) {
        await queryRunner.rollbackTransaction();
        console.error('Error creating user:', error);
        return errorMessage('Error creating user', error);
      } finally {
        await queryRunner.release();
      }
    } catch (error) {
      console.error('Error managing transaction:', error);
      return errorMessage('Error creating user', error);
    }
  }




  async findAll(): Promise<
    SuccessMessageResponse<UserEntity[]> |  ErrorMessageResponse<void>
  > {
    return successMessage(
      'All Users',
      await this.userRepository.find({select:['name','email'] }),
    );
  }

  async findOne(email: string): Promise<any> {
    try {
      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
  
      try {
        const user = await queryRunner.manager.findOne(UserEntity, {
          where: { email: email },
          relations: ["creditCard"], // Specify the relations to load
        });
        if (!user) {
          throw new NotFoundException(`User with Email ${email} not found`);
        }
  
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
  
        await queryRunner.commitTransaction();
  
        return successMessage('User', returnedData);
      } catch (error) {
        await queryRunner.rollbackTransaction();
        throw errorMessage(`Error finding user with Email ${email}`, error);
      } finally {
        await queryRunner.release();
      }
    } catch (error) {
      console.error('Error managing transaction:', error);
      return errorMessage('Error finding user', error);
    }
  }
  


}
