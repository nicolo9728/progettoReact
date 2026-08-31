import { IsInt, IsString } from "class-validator";

export class CreaPrestitoDto{
    @IsString()
    isbn: string
}