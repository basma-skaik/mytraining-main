import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserProvider } from './users.provider';
import { DashboardModule } from '../dashboard/dashboard.module';

@Module({
  imports: [DashboardModule],
  controllers: [UsersController],
  providers: [UsersService, ...UserProvider],
  exports: [UsersService],
})
export class UsersModule {}
