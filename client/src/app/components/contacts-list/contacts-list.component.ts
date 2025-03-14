import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Contact } from 'src/app/models/contact.model';
import { ContactsService } from 'src/app/services/contacts.service';

@Component({
  selector: 'lagom-contacts-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contacts-list.component.html',
  styleUrls: [ './contacts-list.component.scss' ]
})
export class ContactsListComponent implements OnInit {
  private readonly contactsService = inject(ContactsService);
  
  contacts: Contact[] = [];

  ngOnInit(): void {
    this.fetchContacts();
  }

  fetchContacts() {
    this.contactsService.getContacts().subscribe((contacts) => {
      this.contacts = contacts;
    });
  }
}
