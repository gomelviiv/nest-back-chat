import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import * as path from 'path'
import * as fs from 'fs'
import * as uuid from 'uuid'

import { FileType } from "./file.constant";


@Injectable()
export class FileService{

    createFile(type: FileType, file){
            try {
                const fileExtension = file.originalname.split('.').pop()
                const fileName = uuid.v4() + '.' + fileExtension
                const filePath = path.resolve(__dirname, '..', 'static')

                if(!fs.existsSync(filePath)){
                    fs.mkdirSync(filePath, {recursive: true})
                }
                fs.writeFileSync(path.resolve(filePath, fileName), file.buffer)
            
            } catch (error) {
                throw new HttpException(error.messagem, HttpStatus.INTERNAL_SERVER_ERROR)
            }
    }

    removeFile(fileName: string){

    }

}