import { BadRequestException, Body, Controller, InternalServerErrorException, NotFoundException, Post, Req, UseGuards } from "@nestjs/common";
import { UnitOfWork } from "../database/unitOfWork";
import type { Request } from "express";
import { JwtAuthGuard } from "../auth/jwt.guard";
import { JwtRolesGuard } from "../auth/jwtRoles.guard";
import { Role, Roles } from "../auth/roles.decorator";
import { CurrentUser } from "../auth/currentUser.decorator";
import type { UtenteLoggatoViewModel } from "common";
import { Prestito } from "../models/prestito";
import { CreaPrestitoDto } from "../dtos/creaPrestitoDto";

@Controller("prestiti")
export class PrestitoController{
    constructor(private unitOfWork: UnitOfWork){}

    @Post()
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Roles(Role.Cliente)
    public async creaPrestito(@CurrentUser() utente: UtenteLoggatoViewModel, @Body() prestitoDto: CreaPrestitoDto){
        return await this.unitOfWork.execute(async (rep)=>{
            const utenteCorrente = await rep.utenteRepository.getUtenteByUsername(utente.username)
            if(!utenteCorrente)
                throw new NotFoundException()
            
            const libro = await rep.libroRepository.getLibroByIsbn(prestitoDto.isbn)

            if(!libro)
                throw new NotFoundException()

            if(!libro.isDisponibile())
                throw new InternalServerErrorException("Libro non piu disponibile")
            
            if(await rep.prestitoRepository.hasActivePrestito(utenteCorrente.id))
                throw new BadRequestException("Hai gia un prestito attivo")

            const prestito = Prestito.creaPrestito(new Date(Date.now()), utenteCorrente.id, libro.isbn)

            libro.prelevaCopia()

            await rep.libroRepository.save(libro)
            await rep.prestitoRepository.save(prestito)

            return {message: "Ok"}
        })
    }
}