import { Controller, Get, Injectable } from "@nestjs/common";
import { GetGeneriQuery } from "../database/queries/getGeneriQuery";

@Injectable()
@Controller("generi")
export class GeneriController{

    constructor(private getGeneriQuery: GetGeneriQuery){}

    @Get()
    public getGeneri(){
        return this.getGeneriQuery.query()
    }
}