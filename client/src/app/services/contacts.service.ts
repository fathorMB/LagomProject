import { inject, Injectable } from '@angular/core';
import { NetworkService } from './network.service';
import { Observable } from 'rxjs';
import { UpdateContactRequest } from '../models/contacts/update-contact-request.model';
import { UpdateContactResponse } from '../models/contacts/update-contact-response.model';
import { Contact } from '../models/contacts/contact.model';
import { CreateContactRequest } from '../models/contacts/create-contact-request.model';
import { CreateContactResponse } from '../models/contacts/create-contact-response.model';
import { BusinessServiceResponse } from '../models/common/business-service-response.model';
import { buildQueryString } from '../helpers/query-string-builder';

@Injectable({
  providedIn: 'root'
})
export class ContactsService {  
  private readonly networkService = inject(NetworkService);
  private readonly route = 'contacts';

  getContacts(): Observable<Contact[]> {
    return this.networkService.get<Contact[]>(this.route + '/all');
  }

  getContactById(id: number): Observable<Contact> {
    var queryString = buildQueryString(new URLSearchParams({ id: id.toString() }));
    return this.networkService.get<Contact>(this.route + queryString);
  }

  addContact(contact: Contact): Observable<CreateContactResponse> {
    var createContactRequest: CreateContactRequest = { contact: contact, requestId: '' };
    return this.networkService.post<CreateContactResponse>(this.route, createContactRequest);
  }

  updateContact(contact: Contact): Observable<UpdateContactResponse> {
    var updateContactRequest: UpdateContactRequest = { contact: contact, requestId: '' };
    return this.networkService.put<UpdateContactResponse>(this.route, updateContactRequest);
  }

  deleteContact(id: number): Observable<BusinessServiceResponse> {
    var queryString = buildQueryString(new URLSearchParams({ id: id.toString() }));
    return this.networkService.delete<BusinessServiceResponse>(this.route + queryString);
  }
}
