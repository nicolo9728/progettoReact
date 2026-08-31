import { BadRequestException, Body, Controller, Get, InternalServerErrorException, NotFoundException, Param, Post, Query, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { GetLibriQuery } from "../database/queries/getLibriQuery";
import { LibroDettailsViewModel, LibroViewModel, RisultatoPaginatoViewModel } from "common";
import { StorageService } from "../services/storageService";
import { GetLibroByIsbnQuery } from "../database/queries/getLibroByIsbnQuery";
import { JwtAuthGuard } from "../auth/jwt.guard";
import { JwtRolesGuard } from "../auth/jwtRoles.guard";
import { Role, Roles } from "../auth/roles.decorator";
import { FileInterceptor } from "@nestjs/platform-express";
import { CreaLibroDto } from "../dtos/creaLibroDto";
import { UnitOfWork } from "../database/unitOfWork";
import { Libro } from "../models/libro";
import { diskStorage } from "multer";
import os from "os"
import { createReadStream, unlinkSync } from "fs";

@Controller("libri")
export class LibriController {

    constructor(
        private getLibriQuery: GetLibriQuery,
        private getLibroByIsbnQuery: GetLibroByIsbnQuery,
        private storageService: StorageService,
        private unitOfWork: UnitOfWork) { }

    private convertToCorrectUrlPagina(ris: RisultatoPaginatoViewModel<LibroViewModel>): RisultatoPaginatoViewModel<LibroViewModel> {
        return {
            ...ris,
            elementi: ris.elementi.map((el) => ({ ...el, immagine: this.storageService.getEffectiveUrl(el.immagine) }))
        }
    }

    private convertToCorrectUrlLibroDetails(libro: LibroDettailsViewModel): LibroDettailsViewModel {
        return {
            ...libro,
            immagine: this.storageService.getEffectiveUrl(libro.immagine)
        }
    }

    @Get()
    public async getLibriByPagina(@Query("pagina") pagina: number = 1) {
        return this.convertToCorrectUrlPagina(await this.getLibriQuery.query({ pagina }))
    }

    @Get(":isbn")
    public async getLibroByIsbn(@Param("isbn") isbn: string) {
        const libro = await this.getLibroByIsbnQuery.query({ isbn })
        if (!libro)
            throw new NotFoundException("Isbn non valido")
        return this.convertToCorrectUrlLibroDetails(libro)
    }

    @Post()
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Roles(Role.Admin)
    @UseInterceptors(
        FileInterceptor('immagine', {
            storage: diskStorage({
                destination: os.tmpdir(),
                filename: (req, file, cb) => {
                    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
                    cb(null, `${uniqueSuffix}-${file.originalname}`);
                },
            }),
        }),
    )
    public async creaLibro(
        @UploadedFile() file: Express.Multer.File,
        @Body() dto: CreaLibroDto
    ) {
        if (!file) {
            throw new BadRequestException("Immagine mancante");
        }

        // 1. Crea lo stream a partire dal file temporaneo salvato su disco
        const fileStream = createReadStream(file.path);

        let immagine: string = "";

        try {

            immagine = await this.storageService.uploadFile(fileStream, file.originalname, file.mimetype);

            await this.unitOfWork.execute(async (rep) => {
                const libroTrovato = await rep.libroRepository.getLibroByIsbn(dto.isbn);
                if (libroTrovato) {
                    throw new InternalServerErrorException("Libro già registrato");
                }

                const libro = Libro.creaLibro(dto.isbn, dto.titolo, dto.trama, immagine);
                await rep.libroRepository.save(libro);
            });

            return {message: "Ok"}

        } catch (e) {
            if (immagine) {
                await this.storageService.deteleFile(immagine);
            }
            throw e;
        } finally {
            
            if (file.path) {
                unlinkSync(file.path);
            }
        }
    }
}