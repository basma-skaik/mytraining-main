import { Transform } from 'class-transformer';
import { IsString, IsNotEmpty} from 'class-validator';
import { trimmer } from 'src/common/validators/trim.transform';

export class CreateDashboardDto {
  @Transform(trimmer)
  @IsString()
  @IsNotEmpty()
  title: string;
}
