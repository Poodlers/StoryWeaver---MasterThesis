export interface IDataRepository {
    getFile: (fileName: string) => Promise<Blob>;
    uploadFile: (file: File) => Promise<any>;
    deleteFile: (fileName: string) => Promise<any>;
}