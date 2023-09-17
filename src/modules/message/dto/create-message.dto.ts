import { Transform } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";
import { trimmer } from "src/common/validators/trim.transform";

export class CreateMessageDto {
  @Transform(trimmer)
  @IsString()
  @IsNotEmpty()
  text: string;
}
