import { S3Client, PutObjectCommand, HeadObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
    region: 'auto',
    endpoint: 'https://5aa4c0acb0e25214c16ca695275482a8.r2.cloudflarestorage.com',
    credentials: {
      accessKeyId: '047595cdddd6f641d1665c8df6795aee',
      secretAccessKey: '05e386894068a1329c5a2236b1661c2f46dbc8d0cc81f22d451a2b5f2c0c0ccb',
    },
});

