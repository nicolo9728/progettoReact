import { IsNotEmpty, IsString } from "class-validator";

export class RegitrazioneUtenteDto{
    @IsString()
    @IsNotEmpty()
    username: string

    @IsString()
    @IsNotEmpty()
    password: string

    @IsString()
    @IsNotEmpty()
    confermaPassword: string
}