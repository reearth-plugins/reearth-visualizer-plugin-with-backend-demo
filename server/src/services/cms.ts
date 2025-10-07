import axios from "axios";
import FormData from "form-data";

import { Photograph, CreatePhotographRequest, UploadedAsset } from "../types";

const CMS_BASE_URL = process.env.REEARTH_CMS_INTEGRATION_API_BASE_URL;
const CMS_TOKEN = process.env.REEARTH_CMS_INTEGRATION_API_ACCESS_TOKEN;

type CMSItem = {
  id: string;
  fields: {
    id: string;
    key: string;
    value: string | number | object | boolean | null;
  }[];
  createdAt: string;
}

type CMSResponse = {
  items: CMSItem[];
  totalCount: number;
}

type CMSAsset = {
  id: string;
  url: string;
  fileName: string;
  size: number;
  contentType: string;
  createdAt: string;
}

class CMSService {
  private getHeaders() {
    return {
      Authorization: `Bearer ${CMS_TOKEN}`,
      "Content-Type": "application/json",
    };
  }

  private transformCMSItemToPhotograph(item: CMSItem): Photograph {
    const fields = item.fields.reduce((acc, field) => {
      acc[field.key] = field.value;
      return acc;
    }, {} as Record<string, string | number | object | boolean | null>);

    return {
      id: item.id,
      title: (fields.title as string) || "",
      photoUrl: (fields["photo-url"] as string) || "",
      description: fields.description as string | undefined,
      author: (fields.author as string) || "",
      position: (fields.position as { type: "Point"; coordinates: [number, number] }) || { type: "Point", coordinates: [0, 0] },
      createdAt: item.createdAt,
    };
  }

  private transformPhotographToCMSFields(photo: CreatePhotographRequest) {
    return {
      fields: [
        { key: "title", value: photo.title },
        { key: "photo-url", value: photo.photoUrl },
        { key: "description", value: photo.description || "" },
        { key: "author", value: photo.author },
        { key: "position", value: photo.position },
      ],
    };
  }

  async getPhotographs(
    modelId: string
  ): Promise<{ items: Photograph[]; total: number }> {
    try {
      const response = await axios.get<CMSResponse>(
        `${CMS_BASE_URL}/models/${modelId}/items`,
        { headers: this.getHeaders() }
      );

      const photographs = response.data.items.map((item) =>
        this.transformCMSItemToPhotograph(item)
      );

      return {
        items: photographs,
        total: response.data.totalCount,
      };
    } catch (error) {
      console.error("Failed to fetch photographs from CMS:", error);
      throw new Error("Failed to fetch photographs");
    }
  }

  async createPhotograph(
    modelId: string,
    photograph: CreatePhotographRequest
  ): Promise<Photograph> {
    try {
      const cmsData = this.transformPhotographToCMSFields(photograph);

      const response = await axios.post<CMSItem>(
        `${CMS_BASE_URL}/models/${modelId}/items`,
        cmsData,
        { headers: this.getHeaders() }
      );

      return this.transformCMSItemToPhotograph(response.data);
    } catch (error) {
      console.error("Failed to create photograph in CMS:", error);
      throw new Error("Failed to create photograph");
    }
  }

  async uploadAsset(
    projectId: string,
    file: Express.Multer.File
  ): Promise<UploadedAsset> {
    try {
      const formData = new FormData();
      formData.append('file', file.buffer, {
        filename: file.originalname,
        contentType: file.mimetype,
      });

      const response = await axios.post<CMSAsset>(
        `${CMS_BASE_URL}/projects/${projectId}/assets`,
        formData,
        {
          headers: {
            ...this.getHeaders(),
            ...formData.getHeaders(),
          },
        }
      );

      return {
        id: response.data.id,
        url: response.data.url,
        filename: response.data.fileName,
        size: response.data.size,
        mimeType: response.data.contentType,
        uploadedAt: response.data.createdAt,
      };
    } catch (error) {
      console.error("Failed to upload asset to CMS:", error);
      throw new Error("Failed to upload asset");
    }
  }
}

export const cmsService = new CMSService();
