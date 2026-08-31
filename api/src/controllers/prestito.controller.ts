import { BadRequestException, Body, Controller, ForbiddenException, Get, InternalServerErrorException, NotFoundException, Param, Post, Query, Req, UseGuards } from "@nestjs/common";
import { UnitOfWork } from "../database/unitOfWork";
import type { Request } from "express";
import { JwtAuthGuard } from "../auth/jwt.guard";
import { JwtRolesGuard } from "../auth/jwtRoles.guard";
import { Role, Roles } from "../auth/roles.decorator";
import { CurrentUser } from "../auth/currentUser.decorator";
import type { CurrentUserType } from "../auth/currentUser.decorator"
import type { PrestitoViewModel, StatusPrestito, UtenteLoggatoViewModel } from "common";
import { Prestito, PrestitoStatus } from "../models/prestito";
import { CreaPrestitoDto } from "../dtos/creaPrestitoDto";
import { GetTitoliLibriPrestiti } from "../database/queries/getTitoliLibriPrestiti";

@Controller("prestiti")
export class PrestitoController {
    constructor(private unitOfWork: UnitOfWork, private getPrestitiQuery: GetTitoliLibriPrestiti) { }

    private mapStatus(status: PrestitoStatus): StatusPrestito {
        if (status.tipo == "Restituito")
            return {
                stato: status.tipo,
                momentoRestituzione: status.momentoRestituzione.toISOString()
            }
        else
            return {
                stato: status.tipo
            }
    }

    @Post(":idPrestito/restituzione")
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Roles(Role.Admin)
    public async restituzione(@Param("idPrestito") idPrestito: number){
        return this.unitOfWork.execute(async (rep)=>{
            const prestito = await rep.prestitoRepository.getPrestitoById(idPrestito)
            if(!prestito)
                throw new NotFoundException("Prestito non trovato")
            
            const libro = await rep.libroRepository.getLibroByIsbn(prestito.idLibro)
            if(!libro)
                throw new NotFoundException("Libro non trovato")
            
            prestito.restituisci(new Date(Date.now()))
            libro.restituisciCopia()

            await rep.libroRepository.save(libro)
            await rep.prestitoRepository.save(prestito)

            return {message: "Ok"}
        })
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    public async getPrestiti(@CurrentUser() currentUser: CurrentUserType, @Query("idUtente") idUtente: number): Promise<PrestitoViewModel[]> {
        if(currentUser.ruolo != "Admin" && currentUser.userId != idUtente)
            throw new ForbiddenException("Non autorizzato")

        const prestiti = await this.unitOfWork.repositories
            .prestitoRepository
            .getPrestitiUtente(idUtente)

        const titoliPrestiti = new Map(
            (await this.getPrestitiQuery.query({ idUtente: idUtente })).map((p) => [p.id, p.titolo])
        )

        return prestiti.map<PrestitoViewModel>((p) => ({
            id: p.id,
            momentoPrestito: p.momentoPrestito.toISOString(),
            libro: {
                titolo: titoliPrestiti.get(p.id)!
            },
            stato: this.mapStatus(p.status),
            isScaduto: p.isScaduto(new Date(Date.now()))
        }))
    }

    @Post()
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Roles(Role.Cliente)
    public async creaPrestito(@CurrentUser() utente: CurrentUserType, @Body() prestitoDto: CreaPrestitoDto) {
        return await this.unitOfWork.execute(async (rep) => {
            const utenteCorrente = await rep.utenteRepository.getUtenteByUsername(utente.username)
            if (!utenteCorrente)
                throw new NotFoundException()

            const libro = await rep.libroRepository.getLibroByIsbn(prestitoDto.isbn)

            if (!libro)
                throw new NotFoundException()

            if (!libro.isDisponibile())
                throw new InternalServerErrorException("Libro non piu disponibile")

            if (await rep.prestitoRepository.hasActivePrestito(utenteCorrente.id))
                throw new BadRequestException("Hai gia un prestito attivo")

            const prestito = Prestito.creaPrestito(new Date(Date.now()), utenteCorrente.id, libro.isbn)

            libro.prelevaCopia()

            await rep.libroRepository.save(libro)
            await rep.prestitoRepository.save(prestito)

            return { message: "Ok" }
        })
    }
}