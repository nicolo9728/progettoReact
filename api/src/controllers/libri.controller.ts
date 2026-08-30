import { Controller, Get, NotFoundException, Param, Query } from "@nestjs/common";
import { GetLibriQuery } from "../database/queries/getLibriQuery";
import { LibroDettailsViewModel, LibroViewModel, RisultatoPaginatoViewModel } from "common";
import { StorageService } from "../services/storageService";
import { GetLibroByIsbnQuery } from "../database/queries/getLibroByIsbnQuery";

@Controller("libri")
export class LibriController{

    constructor(
        private getLibriQuery: GetLibriQuery,
        private getLibroByIsbnQuery: GetLibroByIsbnQuery,
        private storageService: StorageService){}

    private convertToCorrectUrlPagina(ris: RisultatoPaginatoViewModel<LibroViewModel>): RisultatoPaginatoViewModel<LibroViewModel>{
        return {
            ...ris,
            elementi: ris.elementi.map((el)=>({...el, immagine: this.storageService.getEffectiveUrl(el.immagine)}))
        }
    }

    private convertToCorrectUrlLibroDetails(libro: LibroDettailsViewModel): LibroDettailsViewModel{
        return {
            ...libro,
            immagine: this.storageService.getEffectiveUrl(libro.immagine)
        }
    }

    @Get()
    public async getLibriByPagina(@Query("pagina") pagina: number = 1){
        return this.convertToCorrectUrlPagina(await this.getLibriQuery.query({pagina}))
    }

    @Get(":isbn")
    public async getLibroByIsbn(@Param("isbn") isbn: string){
        const libro = await this.getLibroByIsbnQuery.query({isbn})
        if(!libro)
            throw new NotFoundException("Isbn non valido")
        return this.convertToCorrectUrlLibroDetails(libro)
    }
}