import { Address } from './model';

export interface User {
    userId: string;
    phoneNumber: string;
    imageURL: string;
    imagePath: string;
    lastName: string;
    firstName: string;
    password: string;
    uid: string;
    address: Address;
}