import { IsInt, IsOptional, IsString, Min } from "class-validator";

export class QueryLibriDto{
    @IsInt()
    pagina: number

    @IsString()
    @IsOptional()
    titolo?: string

    @IsString()
    @IsOptional()
    genere?: string
}