import * as uuid from 'uuid';
import { CreateFeedItemRequest } from '../models/requests/CreateFeedItemRequest';
import { create, getAll } from '../dataLayer/feed'
import { FeedItem } from '../models/feed/FeedItem';

export async function createFeedItem(request: CreateFeedItemRequest, userId: string): Promise<FeedItem> {
  return await create({
    id: uuid.v4(),
    owner: userId,
    createdAt: new Date().toISOString(),
    name: request.name,
    caption: request.caption
  });
}

export async function getFeed(owner: string): Promise<FeedItem[]> {
  return getAll(owner);
}