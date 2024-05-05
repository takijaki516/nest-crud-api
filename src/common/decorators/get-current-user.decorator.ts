import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

// TODO:
export const GetCurrentUser = createParamDecorator(
  (data: any, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest() as Request;

    // passport strategy sets user to request object
    if (!data) return request.user;
    return request.user[data];
  },
);
