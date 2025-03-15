import { APIRequest } from "./abstracts/api-request.model";
import { Contact } from "./contact.model";

export interface UpdateContactRequest extends APIRequest {
    contact: Contact;
}