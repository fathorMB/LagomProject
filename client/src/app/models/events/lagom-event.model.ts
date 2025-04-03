import { Contact } from "../contacts/contact.model";

export interface LagomEvent {
    id: number;
    name: string;
    location: string; 
    start: Date;
    end: Date;
    contacts?: Contact[];
    billOfMaterials?: string[];     /* placeholder for the true lista dei materiali :) */
}