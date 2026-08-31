import { IsNotEmpty, IsString, Length, MaxLength } from "class-validator";

export class CreaLibroDto{
    @IsString()
    @IsNotEmpty()
    @MaxLength(300)
    titolo: string

    @IsString()
    @IsNotEmpty()
    trama: string

    @IsString()
    @IsNotEmpty()
    @Length(13)
    isbn: string

    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    genere: string
}