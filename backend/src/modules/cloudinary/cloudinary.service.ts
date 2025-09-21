import { Injectable } from '@nestjs/common';
import { cloudinary } from './cloudinary.config';
import * as streamifier from 'streamifier';
import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary'

@Injectable()
export class CloudinaryService {

    constructor(){}

    async uploadFile(file: Express.Multer.File, folder: string): Promise<UploadApiResponse>{
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { folder }, 
                (err, result) => {
                    if(err){
                        reject(err as UploadApiErrorResponse)
                    }

                    resolve(result as UploadApiResponse)
                }
            )

            streamifier.createReadStream(file.buffer).pipe(uploadStream)
        })
    }

}
