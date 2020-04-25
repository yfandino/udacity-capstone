import 'source-map-support/register';
import { S3CreateEvent, S3Handler } from 'aws-lambda';
import { addImageURL } from '../businessLogic/feed';
import { makeLogger } from '../utils/logger';

const logger = makeLogger('createFeed');

export const handler: S3Handler = async (event: S3CreateEvent): Promise<void> => {

  const bucket = event.Records[0].s3.bucket.name;
  const key = event.Records[0].s3.object.key;

  logger.info(`Adding object: ${bucket}/${key}`);


  try {
    await addImageURL(bucket, key);
    logger.info("Object added");
  } catch (err) {
    logger.error(err)
  }
}