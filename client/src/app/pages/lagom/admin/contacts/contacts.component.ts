import { AfterViewInit, Component, DestroyRef, inject, Input, OnInit, ViewChild } from '@angular/core';
import { filter } from 'rxjs/operators';
import { ContactCreateUpdateComponent } from './contact-create-update/contact-create-update.component';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TableColumn } from '@vex/interfaces/table-column.interface';
import { SelectionModel } from '@angular/cdk/collections';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { stagger40ms } from '@vex/animations/stagger.animation';
import { FormsModule, ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { VexPageLayoutContentDirective } from '@vex/components/vex-page-layout/vex-page-layout-content.directive';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { VexBreadcrumbsComponent } from '@vex/components/vex-breadcrumbs/vex-breadcrumbs.component';
import { VexPageLayoutHeaderDirective } from '@vex/components/vex-page-layout/vex-page-layout-header.directive';
import { VexPageLayoutComponent } from '@vex/components/vex-page-layout/vex-page-layout.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatInputModule } from '@angular/material/input';
import { Contact } from 'src/app/models/contact.model';
import { ContactsService } from 'src/app/services/contacts.service';
import { CreateContactResponse } from 'src/app/models/create-contact-response.model';
import { UpdateContactResponse } from 'src/app/models/update-contact-response.model';
import { BusinessServiceResponse } from 'src/app/models/business-service-response.model';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'lagom-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss'],
  animations: [fadeInUp400ms, stagger40ms],
  standalone: true,
  imports: [
    VexPageLayoutComponent,
    VexPageLayoutHeaderDirective,
    VexBreadcrumbsComponent,
    MatButtonToggleModule,
    ReactiveFormsModule,
    VexPageLayoutContentDirective,
    NgIf,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
    MatMenuModule,
    MatTableModule,
    MatSortModule,
    MatCheckboxModule,
    NgFor,
    NgClass,
    MatPaginatorModule,
    FormsModule,
    MatDialogModule,
    MatInputModule
  ]
})
export class ContactsComponent implements OnInit, AfterViewInit {
  private readonly _destroyRef: DestroyRef = inject(DestroyRef);
  private readonly _contactsService: ContactsService = inject(ContactsService);
  private readonly _breakpointObserver: BreakpointObserver = inject(BreakpointObserver);

  contacts: Contact[] = [];

  @Input()
  columns: TableColumn<Contact>[] = [
    { label: 'Nick', property: 'nick', type: 'text', visible: true },
    { label: 'First Name', property: 'firstName', type: 'text', visible: true },
    { label: 'Last Name', property: 'lastName', type: 'text', visible: true },
    { label: 'E-Mail', property: 'email', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Phone', property: 'phoneNumber', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Actions', property: 'actions', type: 'button', visible: true }
  ];
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  dataSource!: MatTableDataSource<Contact>;
  selection = new SelectionModel<Contact>(true, []);
  searchCtrl = new UntypedFormControl();

  @ViewChild(MatPaginator, { static: true }) paginator?: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort?: MatSort;  

  constructor(private dialog: MatDialog) {}

  get visibleColumns() {
    return this.columns
      .filter((column) => column.visible)
      .map((column) => column.property);
  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource();
    
    this.initObservableBreakpointStates();
    this.initObservableContacts();    
    this.initSerchCtrl();
  }

  private initObservableContacts(): void {
    var observableContacts = this._contactsService.getContacts();

    observableContacts.subscribe((contacts) => {
      this.contacts = contacts;
    });

    observableContacts
      .pipe(filter<Contact[]>(Boolean))
      .subscribe((contacts) => {
        this.contacts = contacts;
        this.dataSource.data = contacts;
      });
  }
  private initObservableBreakpointStates(): void {
    // Show all columns on extra large, large, medium screens
    this._breakpointObserver
      .observe([Breakpoints.XLarge, Breakpoints.Large, Breakpoints.Medium])
      .subscribe((result) => {
        if (result.matches) {
          this.columns.forEach((column) => { column.visible = true; });
        }
      });

    // Hide columns on small and extra small screens  
    this._breakpointObserver
      .observe([Breakpoints.Small, Breakpoints.XSmall])
      .subscribe((result) => {
        if (result.matches) {
          this.columns.forEach((column) => { 
            if (!['nick', 'actions'].includes(column.property)) { 
              column.visible = false; 
            } 
          });
        }
      });
  }
  private initSerchCtrl(): void {
    this.searchCtrl.valueChanges
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((value) => this.onFilterChange(value));
  }

  ngAfterViewInit() {
    if (this.paginator) { this.dataSource.paginator = this.paginator; }
    if (this.sort) { this.dataSource.sort = this.sort; }
  }

  createContact() {
    this.dialog
      .open(ContactCreateUpdateComponent)
      .afterClosed()
      .subscribe((contact: Contact) => {
        // Contact is the new created contact (if the user pressed Save - otherwise it's null)
        if (contact) {
          this._contactsService
            .addContact(contact)
            .subscribe((createContactResponse: CreateContactResponse) => {
              this.contacts.push(createContactResponse.contact);
              this.dataSource.data = this.contacts;              
            });
        }
      });
  }

  updateContact(contact: Contact) {
    this.dialog
      .open(ContactCreateUpdateComponent, { data: contact })
      .afterClosed()
      .subscribe((updatedContact: Contact) => {
        // Contact is the updated contact (if the user pressed Save - otherwise it's null)
        if (updatedContact) {
          this._contactsService
            .updateContact(updatedContact)
            .subscribe((updateContactResponse: UpdateContactResponse) => {
              const index = this.contacts.findIndex((existingContact) => existingContact.id === updateContactResponse.contact.id);
              this.contacts[index] = updateContactResponse.contact;
              this.dataSource.data = this.contacts;
            });
        }
      });
  }

  deleteContact(contact: Contact) {
    this._contactsService.deleteContact(contact.id).subscribe((businessServiceResponse: BusinessServiceResponse) => {
      this.contacts = this.contacts.filter((c) => c.id !== contact.id);
      this.dataSource.data = this.contacts;
    });
  }

  onFilterChange(value: string) {
    if (!this.dataSource) { return; }

    value = value.trim();
    value = value.toLowerCase();
    this.dataSource.filter = value;
  }

  trackByProperty<T>(index: number, column: TableColumn<T>) { return column.property; }
}
