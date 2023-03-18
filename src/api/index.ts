import axios from 'axios';

import { config } from '../config';

export const api = axios.create({
  baseURL: `${config.API_BASE_URL}/`,
  headers: {
    Authorization: config.VIDEO_SDK_TOKEN,
    'Content-Type': 'application/json'
  }
});
