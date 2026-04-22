// src/api/documents.ts
import api from '../api/axios';

export interface Document {
  id: number;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  owner: { id: number; fio: string };
  fileKey: string | null;
}

export interface DocumentFilter {
  status?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  page: number;
  size: number;
  sortBy: string;
  sortDir: 'asc' | 'desc';
}

export const getDocuments = (filters: DocumentFilter) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') params.append(k, String(v));
  });
  return api.get<{ content: Document[]; totalElements: number }>('/documents', { params });
};

export const createDocument = (data: Partial<Document>) => 
  api.post<Document>('/documents', data);

export const updateDocument = (id: number, data: Partial<Document>) => 
  api.put<Document>(`/documents/${id}`, data);

export const deleteDocument = (id: number) => 
  api.delete(`/documents/${id}`);

export const uploadFile = (id: number, file: File) => {
  const fd = new FormData();
  fd.append('file', file);
  return api.post(`/documents/${id}/upload`, fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const getDownloadUrl = (id: number) => 
  api.get<{ url: string }>(`/documents/${id}/download`);