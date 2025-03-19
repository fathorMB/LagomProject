import { APIRequest } from "../abstracts/api-request.model";
import { Contact } from "./contact.model";

export interface CreateContactRequest extends APIRequest {
    contact: Contact;
}