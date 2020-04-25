import * as AWS from 'aws-sdk';
import { makeLogger } from '../utils/logger';

const logger = makeLogger('s3layer');

const ATTACHMENTS_BUCKET = process.env.ATTACHMENTS_BUCKET

const S3 = new AWS.S3({
  signatureVersion: 'v4'
});

export async function getUploadSignedURL(id: string, owner: string): Promise<string> {
  logger.info(`Generating new Upload URL for user: ${owner}`);
  logger.info(`Key: ${owner}/${id}`);

  const uploadURL = S3.getSignedUrl('putObject', {
    Bucket: ATTACHMENTS_BUCKET,
    Key: `${owner}/${id}`,
    Expires: 300
  });
  
  return uploadURL;
}