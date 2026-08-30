import { ExecutionContext, Inject } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Role, ROLES_KEY } from "./roles.decorator";
import { AuthGuard } from "@nestjs/passport";

export class JwtRolesGuard extends AuthGuard('jwt') {

    constructor(@Inject(Reflector) private reflector: Reflector) { super() }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        
        if (!requiredRoles) {
            return true;
        }

        const { user } = context.switchToHttp().getRequest();
        return requiredRoles.includes(user?.ruolo);
    }
}