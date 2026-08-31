import { BadRequestException, Body, Controller, Get, InternalServerErrorException, NotFoundException, Post, Req, UseGuards } from "@nestjs/common";
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

    @Get()
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Roles(Role.Cliente)
    public async getPrestiti(@CurrentUser() currentUser: CurrentUserType): Promise<PrestitoViewModel[]> {
        const prestiti = await this.unitOfWork.repositories
            .prestitoRepository
            .getPrestitiUtente(currentUser.userId)

        const titoliPrestiti = new Map(
            (await this.getPrestitiQuery.query({ idUtente: currentUser.userId })).map((p) => [p.id, p.titolo])
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