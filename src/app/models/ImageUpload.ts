export interface ImageUploadDTO {
    files: File[] | undefined | null;
    folderPath: string;
    publicIds: string;
    imageDisplay: string;
}

export interface ImageUploadResult {
    imageUrl: string;
    publicId: string;
}