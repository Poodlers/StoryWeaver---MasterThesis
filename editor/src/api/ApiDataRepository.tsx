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

    public uploadFile = async (file: File): Promise<any> => {
        const formData = new FormData();
      
        formData.append('file', file);

        const instance = this.createInstance();

        try{
            const result = await instance.post(`${BASE_URL}/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then(transform);
            return result;
        }
        catch(error){
            console.log(error); 
            throw error;
        }
    }

    public deleteFile = async (fileName: string): Promise<any> => {
        const instance = this.createInstance();

        try{
            const result = await instance.delete(`${BASE_URL}/files/${fileName}`).then(transform);
            return result;
        }
        catch(error){
            console.log(error); 
            throw error;
        }
    }

    public saveProject = async (projectTitle: any, nodes: any, edges: any, characters: any, maps: any): Promise<any> => {
        const instance = this.createInstance();

        try{
            const result = await instance.post(`${BASE_URL}/save`, {
                storyId : localStorage.getItem('storyId'),
                projectTitle : projectTitle,
                nodes: nodes,
                edges: edges,
                characters : characters,
                maps:  maps
            }).then(transform).then((response) => {
                localStorage.setItem('storyId', response.data.storyId);
            });
            return result;
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

    public requestGenerateMarkerFiles = async (fileName: string): Promise<any> => {
        const instance = this.createInstance();

        try{
            const result = await instance.get(`${BASE_URL}/generateMarker/${fileName}`).then(transform);
            return result;
        }
        catch(error){
            console.log(error); 
            throw error;
        }
    }
  
}