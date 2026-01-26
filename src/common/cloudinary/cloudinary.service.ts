import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import { BannerTypeEnum } from 'src/module/profile/dto/profile.dto';

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  /**
   * Upload an image to Cloudinary (unchanged)
   */
  async uploadImage(
    file: Express.Multer.File,
    folder = 'portfolio',
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { folder, resource_type: 'image' },
          (error: UploadApiErrorResponse, result: UploadApiResponse) => {
            if (error) return reject(error);
            resolve(result.secure_url);
          },
        )
        .end(file.buffer);
    });
  }

  /**
   * Upload image OR video (NEW – minimal addition)
   */
async uploadMedia(
  file: Express.Multer.File,
  folder = 'portfolio',
): Promise<{ url: string; type: BannerTypeEnum }> {
  const isVideo = file.mimetype.startsWith('video');

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: isVideo ? 'video' : 'image',
      },
      (error, result) => {
        if (error || !result) {
          return reject(error || new Error('Cloudinary upload failed'));
        }

        resolve({
          url: result.secure_url,
          type: isVideo
            ? BannerTypeEnum.VIDEO
            : BannerTypeEnum.IMAGE,
        });
      },
    ).end(file.buffer);
  });
}


  /**
   * Delete media from Cloudinary using URL (works for image & video)
   */
  async deleteImageByUrl(url: string) {
    const publicId = this.getPublicIdFromUrl(url);
    if (!publicId) return;

    await cloudinary.uploader.destroy(publicId);
  }

  /**
   * Extract Cloudinary publicId from URL
   */
  private getPublicIdFromUrl(url: string): string {
    const parts = url.split('/');
    const folder = parts[parts.length - 2];
    const fileName = parts[parts.length - 1].split('.')[0];
    return `${folder}/${fileName}`;
  }
}
