import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { REPOSITORIES } from 'src/common/constants';
import { Users } from './user.model';
import { CustomLogger } from 'src/common/loggers/winston.logger';
import { CheckItemExistance } from 'src/common/utils';
import { DashboardService } from '../dashboard/dashboard.service';

@Injectable()
export class UsersService {
  constructor(
    @Inject(REPOSITORIES.USER_REPOSITORY)
    private userRepository: typeof Users,
    private dashboardService: DashboardService,
  ) {}

  private readonly logger = new CustomLogger();

  async create(createUserDto: CreateUserDto, transaction: any) {
    // TODO: implement custom decorator to get UserIdentity //Done
    const user = await this.userRepository.create(createUserDto, {
      transaction,
    });
    this.logger.log(
      `Attempting to create user with username ${createUserDto.username}`,
    );

    await this.dashboardService.getOrCreate(
      { title: `Dashboard for user id : ${user.id}` },
      user.id,
      transaction,
    );
    return user;
  }

  async findAll() {
    this.logger.log(`Attempting to find all users`);
    return this.userRepository.findAll();
  }

  async findAllByIds(userIds: number[]) {
    this.logger.log(`Attempting to find all users by IDs: ${userIds}`);
    return this.userRepository.findAll({
      where: {
        id: userIds,
      },
    });
  }

  async findOne(id: number, options?: any) {
    const user = await this.userRepository.findOne({
      where: { id },
      ...options,
    });

    CheckItemExistance(user, 'User not found!');

    this.logger.log(`Attempting to find user with id ${id}`);
    return user;
  }

  async findOneByUsername(username: string) {
    const user = await this.userRepository.findOne({ where: { username } });
    return user;
  }

  async update(id: number, attrs: UpdateUserDto, userId: number) {
    const user = await this.userRepository.findOne({ where: { id } });

    CheckItemExistance(user, 'User not found!');

    await user.update({
      ...attrs,
      updatedBy: userId,
    });
    this.logger.log(`Attempting to update user with id ${id}`);
    return user;
  }

  async remove(id: number, userId: number) {
    const user = await this.userRepository.findOne({ where: { id } });

    CheckItemExistance(user, 'User not found!');

    // Perform soft delete
    user.deletedAt = new Date();
    user.deletedBy = userId;
    this.logger.log(`Attempting to remove user with id ${id}`);
    return user.save();
  }
}
