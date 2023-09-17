import { Transform } from 'class-transformer';
import { IsString, IsEmail, IsNotEmpty, Matches } from 'class-validator';
import { Role } from 'src/common/constants';
import { trimmer } from 'src/common/validators/trim.transform';

// TODO: Add table named Addresses //????
export class CreateUserDto {
  @Transform(trimmer)
  @IsString()
  @IsNotEmpty()
  name: string;

  @Transform(trimmer)
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Transform(trimmer)
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  role: Role;

  // TODO: add custom regex validation //Done
  @IsString()
  @IsNotEmpty()
  @Matches(/^(?=.*[a-z])(?=.*\d)[a-z\d]{8,}$/, { 
    //I've receive an error when i login Invalid password and I am sure that i 
    // insert the correct data ,,, after i updated regex validation and make it simpler it works fine 
    // i don't know why
    message: 'Password must contain at least 8 characters, one lowercase letter and one digit.',
  })
  password: string;
}