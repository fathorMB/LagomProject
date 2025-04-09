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
export class WarehouseComponent { }

