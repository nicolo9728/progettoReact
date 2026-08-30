import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class StorageService{

    constructor(private config: ConfigService){}

    public getEffectiveUrl(url: string){
        return `${this.config.get<string>("COPERTINE_BLOB_URL")}/${url}`
    }
}