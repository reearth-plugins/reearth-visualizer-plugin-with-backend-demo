export type Photograph = {
  id: string;
  title: string;
  photoUrl: string;
  description?: string;
  author: string;
  position: {
    type: 'Point';
    coordinates: [number, number];
  };
  createdAt?: string;
}

export type CreatePhotographRequest = {
  title: string;
  photoUrl: string;
  description?: string;
  author: string;
  position: {
    type: 'Point';
    coordinates: [number, number];
  };
}

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  total?: number;
  error?: {
    code: string;
    message: string;
    details?: {
      field: string;
      message: string;
    }[];
  };
}

export type UploadedAsset = {
  id: string;
  url: string;
  filename: string;
  size: number;
  mimeType: string;
  uploadedAt: string;
}