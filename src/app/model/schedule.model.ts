import { Address } from './model';

export interface Schedule {
     id?: string;
     userId: string;
     imageURL: string;
     imageFullPath: string;
     categoryId: string;
     day: TimeSchedule[];
     job: JobPartner[];   
     address: Address;

 }

 export interface TimeSchedule{
     id : string;
     name : string;
 }

 export interface JobPartner{
    id: string;
    name: string;
    price: number;
  }