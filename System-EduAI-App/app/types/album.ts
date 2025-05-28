export interface AlbumDTO {
  id?: number;
  title: string;
  description?: string;
  classroomId?: number;
  activityId?: number;
  images?: string[];
  createdDate?: string;
  updatedDate?: string;
}

export interface CreateAlbumRequest {
  title: string;
  description?: string;
  classroomId?: number;
  activityId?: number;
  images?: string[];
}

export interface UpdateAlbumRequest {
  title: string;
  description?: string;
  classroomId?: number;
  activityId?: number;
  images?: string[];
}
