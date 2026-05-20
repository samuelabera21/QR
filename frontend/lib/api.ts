import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000",
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("image", file);

  const response = await api.post<{ imageUrl: string }>("/upload", formData);
  return response.data.imageUrl;
}
