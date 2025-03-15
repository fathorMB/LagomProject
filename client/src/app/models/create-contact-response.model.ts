import { APIResponse } from "./abstracts/api-response.model";
import { Contact } from "./contact.model";

export interface CreateContactResponse extends APIResponse {
    contact: Contact;
}