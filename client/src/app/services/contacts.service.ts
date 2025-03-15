import { inject, Injectable } from '@angular/core';
import { NetworkService } from './network.service';
import { Observable } from 'rxjs';
import { Contact } from '../models/contact.model';
import { CreateContactRequest } from '../models/create-contact-request.model';
import { CreateContactResponse } from '../models/create-contact-response.model';
import { BusinessServiceResponse } from '../models/business-service-response.model';
import { UpdateContactRequest } from '../models/update-contact-request.model';
import { UpdateContactResponse } from '../models/update-contact-response.model';

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
    return this.networkService.get<Contact>(this.route + id);
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
    return this.networkService.delete<BusinessServiceResponse>(this.route + '/' + id);
  }
}
