
import { Project } from "../models/Project";
import { ProjectsBaseInfo } from "../models/ProjectsBaseInfo";

export interface IDataRepository {
    getFile: (fileName: string) => Promise<Blob>;
    uploadFile: (file: File) => Promise<any>;
    deleteFile: (fileName: string) => Promise<any>;
    saveProject(projectTitle: any, nodes: any, edges: any, characters: any, maps: any): Promise<any>;
    getProject(projectId: string): Promise<Project>;
    getProjects(): Promise<ProjectsBaseInfo>;
}