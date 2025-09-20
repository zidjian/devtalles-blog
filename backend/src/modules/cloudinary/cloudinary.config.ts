import { v2 as cloudinary } from 'cloudinary';
import { envs } from 'src/config/envs';

cloudinary.config({
    cloud_name: envs.cloudinaryCloudName,
    api_key: envs.cloudinaryApiKey,
    api_secret: envs.cloudinaryApiSecret,
});

export { cloudinary };