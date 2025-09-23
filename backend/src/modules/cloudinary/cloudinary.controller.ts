import { Controller, Post, UseInterceptors } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('cloudinary')
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const url = await this.cloudinaryService.uploadFile(file, 'uploads');
    return { url: url.secure_url };
  }
}
