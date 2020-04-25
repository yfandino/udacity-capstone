import * as AWS from 'aws-sdk';
import { makeLogger } from '../utils/logger';

const AWSXRay =require('aws-xray-sdk');
const XAWS = AWSXRay.captureAWS(AWS);

const logger = makeLogger('s3layer');

const IMAGES_BUCKET = process.env.IMAGES_BUCKET

const S3 = new XAWS.S3({
  signatureVersion: 'v4'
});

export async function getUploadSignedURL(id: string, owner: string): Promise<string> {
  logger.info(`Generating new Upload URL for user: ${owner}`);
  logger.info(`Key: ${owner}/${id}`);

  const uploadURL = S3.getSignedUrl('putObject', {
    Bucket: IMAGES_BUCKET,
    Key: `${owner}/${id}`,
    Expires: 300
  });
  
  return uploadURL;
}