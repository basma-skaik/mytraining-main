import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dtos/signIn.dto';
import { Public, TransactionParam } from 'src/common/decorator';
import { CreateUserDto } from 'src/modules/users/dtos/create-user.dto';
import { Roles } from 'src/common/decorator/roles.decorator';
import { Role } from 'src/common/constants';
import { TransactionInterceptor } from 'src/common/interceptors';
import { Transaction } from 'sequelize';

@Roles(Role.Admin)
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // put login & sign up in auth service
  @Public()
  @Post('login')
  async signIn(@Body() signInDto: SignInDto) {
    const { user, access_token } = await this.authService.signIn(
      signInDto.username,
      signInDto.password,
    );

    const userId = user.id;
    return { access_token, userId };
  }

  @Public()
  @Post('signup')
  @UseInterceptors(TransactionInterceptor)
  async signup(
    @Body() createUserDto: CreateUserDto,
    @TransactionParam() transaction: Transaction,
  ) {
    return this.authService.signUp(createUserDto, transaction);
  }
}
