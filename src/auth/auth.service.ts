import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { CustomLogger } from 'src/common/loggers/winston.logger';
import { CheckItemExistance, checkItemDuplicate } from 'src/common/utils';
import { CreateUserDto } from 'src/modules/users/dtos/create-user.dto';
import { UsersService } from 'src/modules/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  private readonly logger = new CustomLogger();

  async signUp(createUserDto: CreateUserDto, transaction: any) {
    const username = createUserDto.username;
    const existingUser = await this.userService.findOneByUsername(username);

    checkItemDuplicate(existingUser, 'Username is arleady exist!');

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // TODO: use spread uperator to spread the DTO //Done
    const user = await this.userService.create(
      {
        ...createUserDto,
        password: hashedPassword,
      },
      transaction,
    );
    this.logger.log(
      `Attempting to create user with username ${createUserDto.username}`,
    );
    return user;
  }

  async signIn(username: string, password: string) {
    const user = await this.userService.findOneByUsername(username);

    CheckItemExistance(user, 'User not found!', this.logger);

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      this.logger.error(`Invalid username or password`);
      throw new HttpException(
        'Invalid username or password',
        HttpStatus.FORBIDDEN,
      );
    }

    // TODO:return all the user object except password //Done ,,
    // but i think i won't use all user proparites , i just use userId

    const payload = { id: user.id };

    this.logger.log(
      `SignIn user with username ${username} and password ${password}`,
    );
    return {
      user,
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
