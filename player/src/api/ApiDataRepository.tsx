import axios, { AxiosResponse, AxiosRequestConfig } from "axios";
import { HttpClient } from "./HttpClient";
import { IDataRepository } from "./IDataRepository";
import { BASE_URL } from "../data/constants";
import { ProjectsBaseInfo } from "../models/ProjectsBaseInfo";
import { Project } from "../models/Project";


export class ApiResponse<T> {
    data?: T;
    succeeded?: boolean;
    errors: any;
}


const transform = (response: AxiosResponse): Promise<ApiResponse<any>> => {
  
    return new Promise((resolve, reject) => {
     
      const result: ApiResponse<any> = {
        data: response,
        succeeded: response.status === 200,
        errors: response,
      };
      resolve(result);
    });
  };


export class ApiDataRepository extends HttpClient implements IDataRepository{
    private static instance: ApiDataRepository;
    private constructor() {
        super();
    }
    public static getInstance(): ApiDataRepository {
        if (!ApiDataRepository.instance) {
            ApiDataRepository.instance = new ApiDataRepository();
        }

        return ApiDataRepository.instance;
    }

    public getFile = async (fileName: string): Promise<Blob> => {
        const config: AxiosRequestConfig = {
            responseType: 'blob',
        };
        
        const instance = this.createInstance();

        try{
            const result = await instance.get(`${BASE_URL}/files/${fileName}`, config).then(transform);
            
            return result.data;
        }
        catch(error){
            console.log(error); 
            throw error;
        }
 
    }

    public getProject = async (projectId: string): Promise<Project> => {
        const instance = this.createInstance();

        try{
            const result = await instance.get(`${BASE_URL}/load/${projectId}`).then(transform);
            return result.data;
        }
        catch(error){
            console.log(error); 
            throw error;
        }
    }

    public getProjects = async (): Promise<ProjectsBaseInfo> => {
        const instance = this.createInstance();

        try{
            const result = await instance.get(`${BASE_URL}/projects`).then(transform);
            return result.data;
        }
        catch(error){
            console.log(error); 
            throw error;
        }
    }

    public searchProjects = async (searchText: string): Promise<ProjectsBaseInfo> => {
        const instance = this.createInstance();

        try{
            const result = await instance.get(`${BASE_URL}/projects/${searchText}`).then(transform);
            return result.data;
        }
        catch(error){
            console.log(error); 
            throw error;
        }
    }
  
}