import { S3Client, HeadObjectCommand, DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';
import path from 'path';

const s3Client = new S3Client({
  region: 'auto',
  endpoint: process.env.AWS_ENDPOINT,
  credentials: {
    accessKeyId: process.env.AWS_ACCESSKEYID,
    secretAccessKey: process.env.AWS_SECRETACCESSKEY,
  },
});

export const uploadOnS3 = async (localFilePath, commingFrom = null, existingKey = null) => {
  try {
    if (!localFilePath) {
      throw new Error('No local file path provided');
    }
    const fileExtension = path.extname(fileExtension.originalname);
    const fileContent = await fs.promises.readFile(localFilePath);

    // If an existing key is provided, delete the existing object before uploading the new one
    if (existingKey) {
      const headParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: existingKey
      };
      try {
        await s3Client.send(new HeadObjectCommand(headParams));
        await s3Client.send(new DeleteObjectCommand(headParams));
        console.log("Existing file deleted from S3:", existingKey);
      } catch (err) {
      }
    }

    // Generate a unique key for the S3 
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const key = `${commingFrom}${timestamp}_${randomString}_${path.basename(localFilePath)}.${fileExtension}`;

    console.log("Key: ", key)

    // Upload the file to S3
    const uploadParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      Body: fileContent,
    };

    const uploadCommand = new PutObjectCommand(uploadParams);
    const response = await s3Client.send(uploadCommand);

    // Delete the local file after successful upload
    fs.promises.unlink(localFilePath);
    return response;
  } catch (error) {
    await fs.promises.unlink(localFilePath).catch(console.error);
    console.error('Error uploading file to S3:', error);
    throw error;
  }
};
