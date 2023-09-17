import { Injectable, NestInterceptor, ExecutionContext, CallHandler, forwardRef, SetMetadata } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class TransactionInterceptor implements NestInterceptor {
  constructor(private readonly sequelize: Sequelize) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const handler = context.getHandler();
    const target = context.getClass();
    const isTransactional = Reflect.getMetadata('transactional', target) || Reflect.getMetadata('transactional', handler);

    if (!isTransactional) {
      return next.handle();
    }

    const transaction = await this.sequelize.transaction();
    try {
      context.switchToHttp().getRequest().transaction = transaction;
      const result = await next.handle().toPromise();
      await transaction.commit();
      return result;
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
}

export const TransactionInterceptorProvider = {
  provide: TransactionInterceptor,
  useFactory: (sequelize: Sequelize) => new TransactionInterceptor(sequelize),
  inject: [Sequelize],
};