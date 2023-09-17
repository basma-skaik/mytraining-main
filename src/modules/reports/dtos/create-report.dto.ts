import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';
import { trimmer } from 'src/common/validators/trim.transform';


export class CreateReportDto {
  @IsString()
  @IsNotEmpty()
  @Transform(trimmer)
  description: string;

  @IsNotEmpty()
  @IsNumber()
  userId: number;
}
