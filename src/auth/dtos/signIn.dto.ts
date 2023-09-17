import { Transform } from 'class-transformer';
import { IsString, IsNotEmpty } from 'class-validator';
import { trimmer } from 'src/common/validators/trim.transform';

export class SignInDto {
  @IsString()
  @IsNotEmpty()
  @Transform(trimmer)
  username: string;

  @IsString()
  @IsNotEmpty()
  @Transform(trimmer)
  password: string;
}