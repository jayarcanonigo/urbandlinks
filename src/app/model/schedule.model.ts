export interface Schedule {
     id?: string;
     userId: string;
     categoryId: string;
     day: TimeSchedule[];
     job: JobPartner[];   
     address: string;

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