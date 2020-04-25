import { CreateFeedItemRequest } from '../models/requests/CreateFeedItemRequest';
import { UpdateFeedItemRequest } from '../models/requests/UpdateFeedItemRequest';
import { createOrUpdate, getAll, deleteItem, addFeedItemURL } from '../dataLayer/feed';
import { getUploadSignedURL } from '../dataLayer/s3Feed'
import { FeedItem } from '../models/feed/FeedItem';

export async function createFeedItem(request: CreateFeedItemRequest, userId: string): Promise<FeedItem> {
  return await createOrUpdate({
    id: request.id,
    owner: userId,
    createdAt: new Date().toISOString(),
    name: request.name,
    caption: request.caption,
    url: request.url
  }, "Create");
}

export async function getFeed(owner: string): Promise<FeedItem[]> {
  return await getAll(owner);
}

export async function updateFeedItem(request: UpdateFeedItemRequest): Promise<FeedItem> {
  return await createOrUpdate(request, "Update");
}

export async function deleteFeedItem(id: string, owner: string): Promise<void> {
  return await deleteItem(id, owner);
}

export async function getSignedURL(id: string, owner: string): Promise<string> {
  return await getUploadSignedURL(id, owner);
}

export async function addImageURL(bucket: string, key: string): Promise<void> {
  return await addFeedItemURL(bucket, key)
}