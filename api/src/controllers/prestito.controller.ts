import { Controller, Post, Req, UseGuards } from "@nestjs/common";
import { UnitOfWork } from "../database/unitOfWork";
import type { Request } from "express";
import { JwtAuthGuard } from "../auth/jwt.guard";
import { JwtRolesGuard } from "../auth/jwtRoles.guard";
import { Role, Roles } from "../auth/roles.decorator";
import { CurrentUser } from "../auth/currentUser.decorator";
import type { UtenteLoggatoViewModel } from "common";

@Controller("prestiti")
export class PrestitoController{
    constructor(private unitOfWork: UnitOfWork){}

    @Post()
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Roles(Role.Cliente)
    public async creaPrestito(@CurrentUser() utente: UtenteLoggatoViewModel){
        return await this.unitOfWork.execute(async (rep)=>{
            const utenteCorrente = await rep.utenteRepository.getUtenteByUsername(utente.username)
            
        })
    }
}