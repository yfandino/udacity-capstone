import * as uuid from 'uuid';
import { apiEndpoint } from '../config'
import { FeedItem } from '../types/FeedItem';
import { CreateFeedItemRequest } from '../types/CreateFeedItemRequest';
import Axios from 'axios'
import { UpdateFeedItemRequest } from '../types/UpdateFeedItemRequest';

export async function getFeed(idToken: string): Promise<FeedItem[]> {
  console.log('Fetching feed')

  const response = await Axios.get(`${apiEndpoint}/feed`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('Feed:', response.data)
  return response.data.items
}

export async function createFeedItem(idToken: string, inputItem: CreateFeedItemRequest): Promise<FeedItem> {
  const id = uuid.v4()

  // Get s3 upload url
  const url = await getUploadUrl(idToken, id);

  // Upload File
  await uploadFile(url, inputItem.file)

  const newItem: FeedItem = {
    id,
    name: inputItem.name,
    caption: inputItem.caption,
    url: url.substring(0, url.indexOf("?"))
  }


  const response = await Axios.post(`${apiEndpoint}/feed`,  JSON.stringify(newItem), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.item
}

export async function updateFeedItem(idToken: string, updatedFeedItem: UpdateFeedItemRequest): Promise<void> {
  await Axios.put(`${apiEndpoint}/feed`, JSON.stringify(updatedFeedItem), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function deleteFeedItem(idToken: string, feedId: string): Promise<void> {
  await Axios.delete(`${apiEndpoint}/feed/${feedId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(idToken: string, feedId: string): Promise<string> {
  const response = await Axios.post(`${apiEndpoint}/feed/${feedId}/upload`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.url
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  await Axios.put(uploadUrl, file)
}
