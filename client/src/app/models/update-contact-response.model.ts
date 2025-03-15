import { APIResponse } from "./abstracts/api-response.model";
import { Contact } from "./contact.model";

export interface UpdateContactResponse extends APIResponse {
    contact: Contact;
}