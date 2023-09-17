import { Global, Module } from '@nestjs/common'; // Import forwardRef
import { databaseProvider } from './database.provider';

@Global()
@Module({
  providers: [...databaseProvider],
  exports: [...databaseProvider],
})
export class DatabaseModule {}
