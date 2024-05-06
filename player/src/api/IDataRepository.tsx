import { Project } from "../models/Project";
import { ProjectsBaseInfo } from "../models/ProjectsBaseInfo";

export interface IDataRepository {
    getFile: (fileName: string) => Promise<Blob>;
    getProject(projectId: string): Promise<Project>;
    getProjects(): Promise<ProjectsBaseInfo>;
    searchProjects(searchText: string): Promise<ProjectsBaseInfo>;
}