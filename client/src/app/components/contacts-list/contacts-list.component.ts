import { Component, inject } from '@angular/core';
import { Contact } from 'src/app/pages/apps/contacts/interfaces/contact.interface';
import { ContactsService } from 'src/app/services/contacts.service';

@Component({
  selector: 'lagom-contacts-list',
  standalone: true,
  imports: [],
  templateUrl: './contacts-list.component.html',
  styleUrl: './contacts-list.component.scss'
})
export class ContactsListComponent {
  private readonly contactsService = inject(ContactsService);
  
  contacts: Contact[] = [];

  constructor() {
    this.fetchContacts();
  }

  fetchContacts() {
    this.contactsService.getContacts().subscribe((contacts) => {
      this.contacts = contacts;
    });
  }
}
