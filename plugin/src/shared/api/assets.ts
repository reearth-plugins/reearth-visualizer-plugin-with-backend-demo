import { getApiClient } from "./client";
import { UploadedAsset, ApiResponse } from "./types";

export const assetsApi = {
  async upload(file: File): Promise<ApiResponse<UploadedAsset>> {
    const client = getApiClient();
    if (!client) {
      throw new Error("API client is not initialized.");
    }
    return client.uploadFile<UploadedAsset>("/api/assets/upload", file);
  },
};
