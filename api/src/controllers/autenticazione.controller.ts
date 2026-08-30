import { BadRequestException, Body, Controller, Get, Post, Req, Res, UseGuards } from "@nestjs/common";
import { UnitOfWork } from "../database/unitOfWork";
import { LoginDto } from "../dtos/loginDto";
import { JwtService } from "@nestjs/jwt"
import { Utente } from "../models/utente";
import type { Request, Response } from "express"
import { ConfigService } from "@nestjs/config";
import { JwtAuthGuard } from "../auth/jwt.guard";
import { JwtRolesGuard } from "../auth/jwtRoles.guard";
import { Role, Roles } from "../auth/roles.decorator";

@Controller("auth")
export class AutenticazioneController {
    constructor(private unitOfWork: UnitOfWork, private jwtService: JwtService, private config: ConfigService) { }

    private genToken(utente: Utente) {
        return this.jwtService.sign({ sub: utente.id, username: utente.username, ruolo: utente.constructor.name}, {secret: this.config.get<string>("JWT_SECRET")})
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    public async getUtenteLoggato(@Req() req: Request){
        return req.user
    }

    @Post("/logout")
    @UseGuards(JwtAuthGuard)
    public async logout(@Res({passthrough: true}) res: Response){
        res.clearCookie("access_token")

        return {message: "Logout effettuato"}
    }

    @Post()
    public async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
        const utenteDaAutenticare = await this.unitOfWork.execute<Utente | null>(async (rep) => {
            const utente = await rep.utenteRepository.getUtenteByUsername(loginDto.username)

            if (!utente)
                return null

            if (!utente.comparePassword(loginDto.password))
                return null

            return utente
        })

        if (!utenteDaAutenticare)
            throw new BadRequestException("Credenziali non valide")

        res.cookie("access_token", this.genToken(utenteDaAutenticare), {
            maxAge: 3600000,
            httpOnly: true,
            secure: true,
            sameSite: "lax",
        })

        return { message: "login effettuato con successo" }
    }
}