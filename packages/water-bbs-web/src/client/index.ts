import { client } from '@/api/client.gen';
import { setupInterceptors } from './interceptors';

export function setupClient() {
  setupInterceptors(client);
}
