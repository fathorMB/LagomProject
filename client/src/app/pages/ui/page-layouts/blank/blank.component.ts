import { Component, OnInit } from '@angular/core';
import { VexSecondaryToolbarComponent } from '@vex/components/vex-secondary-toolbar/vex-secondary-toolbar.component';
import { ContactsComponent } from "../../../lagom/admin/contacts/contacts.component";

@Component({
  selector: 'vex-blank',
  templateUrl: './blank.component.html',
  styleUrls: ['./blank.component.scss'],
  standalone: true,
  imports: [VexSecondaryToolbarComponent, ContactsComponent]
})
export class BlankComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
