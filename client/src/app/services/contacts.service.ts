import { Injectable } from '@angular/core';
import { NetworkService } from './network.service';
import { Observable } from 'rxjs';
import { Contact } from '../models/contact.model';

@Injectable({
  providedIn: 'root'
})
export class ContactsService {
  private readonly endpoint = 'contacts/';

  constructor(private networkService: NetworkService) {}

  getContacts(): Observable<Contact[]> {
    return this.networkService.get<Contact[]>(this.endpoint + 'all');
  }

  getContactById(id: number): Observable<Contact> {
    return this.networkService.get<Contact>(this.endpoint + id);
  }

  addContact(contact: Contact): Observable<Contact> {
    return this.networkService.post<Contact>(this.endpoint + 'add', contact);
  }

  updateContact(contact: Contact): Observable<Contact> {
    return this.networkService.put<Contact>(this.endpoint + 'update/' + contact.id, contact);
  }

  deleteContact(id: number): Observable<void> {
    return this.networkService.delete<void>(this.endpoint + 'delete/' + id);
  }
}
