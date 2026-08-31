import "multer"
import { BlobServiceClient, ContainerClient } from "@azure/storage-blob";
import { Injectable, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Readable } from "stream";

@Injectable()
export class StorageService implements OnModuleInit {
    private containerClient: ContainerClient
    constructor(private config: ConfigService) { }

    async onModuleInit() {
        const blobServiceClient = BlobServiceClient.fromConnectionString(this.config.get<string>("BLOB_CONNECTIONS_STRING")!)
        this.containerClient = blobServiceClient.getContainerClient(this.config.get<string>("BLOB_COPERTINE_NAME")!)

        await this.containerClient.createIfNotExists({ access: "blob" })
    }

    public getEffectiveUrl(url: string) {
        return `${this.config.get<string>("COPERTINE_BLOB_URL")}/${url}`
    }

    public async uploadFile(fileStream: Readable, fileName: string, mimeType: string,) : Promise<string>{
        const blobName = `${Date.now()}-${fileName}`;
        const blockBlobClient = this.containerClient.getBlockBlobClient(blobName);
        
        const bufferSize = 4 * 1024 * 1024;
        const maxConcurrency = 5;

        await blockBlobClient.uploadStream(fileStream, bufferSize, maxConcurrency, {
            blobHTTPHeaders: { blobContentType: mimeType },
            
        });

        return blockBlobClient.name;
    }

    public async deteleFile(name: string){
        const blockBlobClient = this.containerClient.getBlockBlobClient(name)
        await blockBlobClient.deleteIfExists()
    }
}