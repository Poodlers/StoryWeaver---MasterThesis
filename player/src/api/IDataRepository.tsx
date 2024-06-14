
import { Project } from "../models/Project";
import { ProjectsBaseInfo } from "../models/ProjectsBaseInfo";
import { User } from "../models/UserInfo";

export interface IDataRepository {
    getFile: (fileName: string) => Promise<Blob>;
    getProject(projectId: string): Promise<Project>;
    getProjects(): Promise<ProjectsBaseInfo>;
    getExportedProjects(): Promise<ProjectsBaseInfo>;
    searchProjects(searchText: string): Promise<ProjectsBaseInfo>;
    getAllUsers() : Promise<any>;
    loginUser(bodyObject: any) : Promise<any>;
    logoutUser() : Promise<any>;
    checkLoginStatus() : Promise<any>;
    markEndingObtained(projectId: string, endingName: string, experienceName: string, allEndings: string[]): Promise<any>;
    getUserInfo() : Promise<User>;
}