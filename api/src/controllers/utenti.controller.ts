import { BadRequestException, Body, Controller, Get, InternalServerErrorException, Post, Query, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt.guard";
import { JwtRolesGuard } from "../auth/jwtRoles.guard";
import { Role, Roles } from "../auth/roles.decorator";
import { IsString, MinLength } from "class-validator";
import { GetUtentiByUsername } from "../database/queries/getUtentiByUsername";
import { RegitrazioneUtenteDto } from "../dtos/registrazioneUtenteDto";
import { UnitOfWork } from "../database/unitOfWork";
import { Client } from "pg";
import { Cliente } from "../models/utente";

class RicercaForm{
    @IsString()
    @MinLength(3)
    username: string
}

@Controller("utenti")
export class UtentiController{

    constructor(private getUtentiByUsername: GetUtentiByUsername, private unitOfWork: UnitOfWork){}

    @Get()
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Roles(Role.Admin)
    public cercaUtenti(@Query() form: RicercaForm){
        return this.getUtentiByUsername.query({username: form.username})
    }

    @Post()
    public async registraUtente(@Body() registrazioneDto: RegitrazioneUtenteDto){
        if(registrazioneDto.password != registrazioneDto.confermaPassword)
            throw new BadRequestException("Le password devono coincidere")

        return await this.unitOfWork.execute(async (rep)=>{
            const utente = Cliente.creaCliente(registrazioneDto.username, registrazioneDto.password)
            
            if(!(await rep.utenteRepository.checkUsernameUnique(registrazioneDto.username)))
                throw new InternalServerErrorException("Username già utilizzato")

            await rep.utenteRepository.save(utente)

            return {message: "Ok"}
        })
    }
}