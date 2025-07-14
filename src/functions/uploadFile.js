import axios from 'axios';
import { API_URL } from '@env'; // or define manually

export const uploadFile = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', {
      uri: file.uri,          // local path to file
      type: file.type,        // MIME type, e.g. 'image/jpeg'
      name: file.name,        // file name
    });

    const response = await axios.post(`${API_URL}/api/file/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error('File upload failed:', error?.response?.data || error.message);
    throw error;
  }
};
