import { getApiClient } from "./client";
import { Photograph, CreatePhotographRequest, ApiResponse } from "./types";

export const photographsApi = {
  async getAll(): Promise<ApiResponse<Photograph[]>> {
    const client = getApiClient();
    if (!client) {
      throw new Error("API client is not initialized.");
    }
    return client.get<Photograph[]>("/api/photographs");
  },

  async create(
    data: CreatePhotographRequest
  ): Promise<ApiResponse<Photograph>> {
    const client = getApiClient();
    if (!client) {
      throw new Error("API client is not initialized.");
    }
    return client.post<Photograph>("/api/photographs", data);
  },
};
