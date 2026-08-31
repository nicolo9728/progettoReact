import { BadRequestException, Controller, Get, Query, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt.guard";
import { JwtRolesGuard } from "../auth/jwtRoles.guard";
import { Role, Roles } from "../auth/roles.decorator";
import { IsString, MinLength } from "class-validator";
import { GetUtentiByUsername } from "../database/queries/getUtentiByUsername";

class RicercaForm{
    @IsString()
    @MinLength(3)
    username: string
}

@Controller("utenti")
export class UtentiController{

    constructor(private getUtentiByUsername: GetUtentiByUsername){}

    @Get()
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Roles(Role.Admin)
    public cercaUtenti(@Query() form: RicercaForm){
        return this.getUtentiByUsername.query({username: form.username})
    }
}