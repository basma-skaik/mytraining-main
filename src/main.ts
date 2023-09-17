import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from './common/guards/auth.guard';
import { CustomLogger } from './common/loggers/winston.logger';
import { UsersService } from './modules/users/users.service';
import { CustomExceptionFilter } from './common/exception.filter/custom-exception.filter';

// TODO: Remove all commented code
// TODO: Add transaction decorator //Done
// TODO: Add custom logger //Done
// TODO: Add custom exception filter //Done

// TODO: 1. Create dashboard, each user has one dashboard, each dashboard has multiple reports //Done
//       2. User can share his dashboard with other users. //Done
//       3. Other users can view and update the reports in the dashboard but cannot delete it.//Done
//       4. The owner cannot remove & add other users to his dashboard //Done

//  TODO:
// 1. Dashboard owner can send broadcast messages to all Dashboard shared users
// 2. When the shared user replies, we want one-to-one conversation between the shared user and owner
// 3. A new conversation will appear between the owner & the shared user
// 4. If the shared user is removed, they will lose the chat from their side
// 5. But, it will remain with the owner
// 6. The owner can create new group messages with any users
// 7. If all users removed from the group the conversation will deleted with all its messages
// 8. Whene owner remove shared user from the dashboard all its conversation will deleted with its messages
// 9. The user can remove hisself from the group

// PROBLEM in Exception filter and validation pipes //Done
//I have a question ,when i what maltipul role users to do the same function , how can i made it?

//other requirements: 
// - write clean code for dashboard service and user.dashboard.shared.service//Done
// - Can add another admin to the dashboard to have the same privileges as the owner except deleting the owner
// - Send invention to the user to accept him join the dashboard //Done
// - Make a group from the dashboard shared user and send a broadcast message to it//Done
// - We need to change group to broadcast or vice versa since all members can't see the reply of each others it still one to one conversation.
// - We can't add a user to conversation unless they are in the dashboard.
// - Removing a user from Dashboard will remove them from conversation //Done

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new CustomLogger(),
  });

  app.useGlobalGuards(
    new AuthGuard(app.get(JwtService), new Reflector(), app.get(UsersService)),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  app.useGlobalFilters(new CustomExceptionFilter(new CustomLogger()));

  await app.listen(3000);
}
bootstrap();
