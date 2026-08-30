import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AutenticazioneController } from "../controllers/autenticazione.controller";
import { JwtStrategy } from "./jwtStrategy";
import { AuthModuleOptions, PassportModule } from "@nestjs/passport";
import { JwtRolesGuard } from "./jwtRoles.guard";

@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: '1h' },
        }),
    ],
    controllers: [AutenticazioneController],
    providers: [JwtStrategy, JwtRolesGuard],
    exports: [JwtStrategy],
})
export class AuthModule { }