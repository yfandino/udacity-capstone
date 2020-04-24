import * as uuid from 'uuid';
import { CreateFeedItemRequest } from '../models/requests/CreateFeedItemRequest';
import { UpdateFeedItemRequest } from '../models/requests/UpdateFeedItemRequest';
import { createOrUpdate, getAll, deleteItem } from '../dataLayer/feed'
import { FeedItem } from '../models/feed/FeedItem';

export async function createFeedItem(request: CreateFeedItemRequest, userId: string): Promise<FeedItem> {
  return await createOrUpdate({
    id: uuid.v4(),
    owner: userId,
    createdAt: new Date().toISOString(),
    name: request.name,
    caption: request.caption
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