import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    // Se passi un parametro specifico (es. @CurrentUser('username')), restituisce solo quello
    return data ? user?.[data] : user;
  },
);