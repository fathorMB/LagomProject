import { Component, DestroyRef, inject, Input, ViewChild } from '@angular/core';
import { VexPageLayoutComponent } from "../../../../../@vex/components/vex-page-layout/vex-page-layout.component";
import { VexPageLayoutHeaderDirective } from "../../../../../@vex/components/vex-page-layout/vex-page-layout-header.directive";
import { VexBreadcrumbsComponent } from "../../../../../@vex/components/vex-breadcrumbs/vex-breadcrumbs.component";
import { VexPageLayoutContentDirective } from "../../../../../@vex/components/vex-page-layout/vex-page-layout-content.directive";
import { MatTabsModule } from '@angular/material/tabs';
import { PageLayoutDemoComponent } from "../../../ui/page-layouts/page-layout-demo/page-layout-demo.component";
import { SelectionModel } from '@angular/cdk/collections';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule, ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TableColumn } from '@vex/interfaces/table-column.interface';
import { filter } from 'rxjs';
import { BusinessServiceResponse } from 'src/app/models/common/business-service-response.model';
import { Contact } from 'src/app/models/contacts/contact.model';
import { CreateContactResponse } from 'src/app/models/contacts/create-contact-response.model';
import { UpdateContactResponse } from 'src/app/models/contacts/update-contact-response.model';
import { ContactsService } from 'src/app/services/contacts.service';
import { ContactCreateUpdateComponent } from '../contacts/contact-create-update/contact-create-update.component';
import { NgIf, NgFor, NgClass, CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'vex-warehouse',
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
    MatInputModule,
    CommonModule,
    MatTabsModule,
    PageLayoutDemoComponent
],
  templateUrl: './warehouse.component.html',
  styleUrl: './warehouse.component.scss'
})
export class WarehouseComponent {
private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly contactsService: ContactsService = inject(ContactsService);
  private readonly breakpointObserver: BreakpointObserver = inject(BreakpointObserver);
  private readonly dialog: MatDialog = inject(MatDialog);

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

  get visibleColumns() {
    return this.columns
      .filter((column) => column.visible)
      .map((column) => column.property);
  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource();
    
    this.breakpointObserver
      .observe([Breakpoints.XLarge, Breakpoints.Large, Breakpoints.Medium, Breakpoints.Small, Breakpoints.XSmall])
      .subscribe((result) => {
        if (result.breakpoints[Breakpoints.XLarge] || result.breakpoints[Breakpoints.Large] || result.breakpoints[Breakpoints.Medium]) {  // Show all columns for large, extra large and medium screens          
          this.columns.forEach((column) => { column.visible = true; });
        } else if (result.breakpoints[Breakpoints.Small] || result.breakpoints[Breakpoints.XSmall]) {   // Hide specific columns for small and extra small screens          
          this.columns.forEach((column) => {
            if (!['nick', 'actions'].includes(column.property)) {
              column.visible = false;
            }
          });
        }
      });
    
    this.contactsService
      .getContacts()
      .pipe(filter<Contact[]>(Boolean))
      .subscribe((contacts) => {
        this.contacts = contacts;
        this.dataSource.data = contacts;
      });

      this.searchCtrl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
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
          this.contactsService
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
          this.contactsService
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
    this.contactsService.deleteContact(contact.id).subscribe((businessServiceResponse: BusinessServiceResponse) => {
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

