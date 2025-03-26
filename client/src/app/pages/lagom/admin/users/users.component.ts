import { AfterViewInit, Component, DestroyRef, inject, Input, OnInit, ViewChild } from '@angular/core';
import { filter } from 'rxjs/operators';
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
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { BusinessServiceResponse } from 'src/app/models/common/business-service-response.model';
import { UsersService } from 'src/app/services/users.service';
import { User } from 'src/app/models/users/user.model';
import { CreateUserResponse } from 'src/app/models/users/create-user-response.model';
import { ChangePasswordComponent } from 'src/app/components/change-password/change-password.component';
import { UserCreateUpdateComponent } from './user-create-update/user-create-update.component';
import { UpdateUserResponse } from 'src/app/models/users/update-user-response.model';
import { MatSlideToggleChange, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { UserToggleEnableResponse } from 'src/app/models/users/user-toggle-enable-response.model';

@Component({
  selector: 'lagom-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
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
    MatSlideToggleModule,
    MatCheckboxModule,
    NgFor,
    NgClass,
    MatPaginatorModule,
    FormsModule,
    MatDialogModule,
    MatInputModule
  ]
})
export class UsersComponent implements OnInit, AfterViewInit {
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly usersService: UsersService = inject(UsersService);
  private readonly breakpointObserver: BreakpointObserver = inject(BreakpointObserver);
  private readonly dialog: MatDialog = inject(MatDialog);

  users: User[] = [];

  @Input()
  columns: TableColumn<User>[] = [
    { label: 'User', property: 'username', type: 'text', visible: true },
    { label: 'First Name', property: 'firstName', type: 'text', visible: true },
    { label: 'Last Name', property: 'lastName', type: 'text', visible: true },
    { label: 'Is Active', property: 'isActive', type: 'button', visible: true },
    { label: 'Claims', property: 'claims', type: 'button', visible: true },
    { label: 'Actions', property: 'actions', type: 'button', visible: true }
  ];
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  dataSource!: MatTableDataSource<User>;
  selection = new SelectionModel<User>(true, []);
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
        // Show all columns for large, extra large and medium screens          
        if (result.breakpoints[Breakpoints.XLarge] || result.breakpoints[Breakpoints.Large] || result.breakpoints[Breakpoints.Medium]) {  
          this.columns.forEach((column) => { column.visible = true; });
        }
        // Hide specific columns for small and extra small screens           
        else if (result.breakpoints[Breakpoints.Small] || result.breakpoints[Breakpoints.XSmall]) {
          this.columns.forEach((column) => {
            if (!['username', 'actions'].includes(column.property)) {
              column.visible = false;
            }
          });
        }
      });

    this.usersService
      .getUsers()
      .pipe(filter<User[]>(Boolean))
      .subscribe((users) => {
        this.users = users;
        this.dataSource.data = users;
      });
    
    this.searchCtrl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => this.onFilterChange(value));
  }

  ngAfterViewInit() {
    if (this.paginator) { this.dataSource.paginator = this.paginator; }
    if (this.sort) { this.dataSource.sort = this.sort; }
  }

  createUser() {
    this.dialog
      .open(UserCreateUpdateComponent)
      .afterClosed()
      .subscribe((userAndPassword) => {        
        if (userAndPassword.user && userAndPassword.password) {   // UserAndPassword is the new created user and password (if the user pressed Save - otherwise it's null)   
          this.usersService
            .addUser(userAndPassword.user, userAndPassword.password)
            .subscribe((createUserResponse: CreateUserResponse) => {
              this.users.push(createUserResponse.user);
              this.dataSource.data = this.users;
            });
        }
      });
  }

  updateUser(user: User) {
    this.dialog
      .open(UserCreateUpdateComponent, { data: user })
      .afterClosed()
      .subscribe((user) => {
        if (user) {    // User is the updated user (if the user pressed Save - otherwise it's null)
          this.usersService
            .updateUser(user)
            .subscribe((updateUserResponse: UpdateUserResponse) => {
              this.updateUserAndRefresh(updateUserResponse.user);     
            });
        }
      });
  }

  deleteUser(user: User) {
    this.usersService
      .deleteUser(user.id)
      .subscribe((businessServiceResponse: BusinessServiceResponse) => {
        this.users = this.users.filter((u) => u.id !== user.id);
        this.dataSource.data = this.users;
      });
  }

  changePassword(user: User) {
    this.dialog
      .open(ChangePasswordComponent, { data: user })
      .afterClosed()
      .subscribe((newPassword: string) => {                
        if (newPassword) {    // NewPassword is the new created password (if the user pressed Save - otherwise it's null)
          this.usersService
            .changePassword(user.id, newPassword)
            .subscribe((businessServiceResponse: BusinessServiceResponse) => {
              console.log('password changed for user ' + user.username);
            });
        }
      });
  }

  toggleActive(user: User) {
    if(user.isActive) {
      this.usersService.disableUser(user.id).subscribe((userToggleEnableResponse: UserToggleEnableResponse) => {
        this.updateUserAndRefresh(userToggleEnableResponse.user);
      });
    } else {
      this.usersService.enableUser(user.id).subscribe((userToggleEnableResponse: UserToggleEnableResponse) => {
        this.updateUserAndRefresh(userToggleEnableResponse.user);
      });
    }
  }

  private updateUserAndRefresh(user: User): void {
    // Find and update the user in the array
    const index = this.users.findIndex(u => u.id === user.id);
    if (index !== -1) {
      this.users[index] = user;
      this.dataSource.data = [...this.users]; // Refresh the dataSource
    }
  }

  onFilterChange(value: string) {
    if (!this.dataSource) {
      return;
    }

    value = value.trim();
    value = value.toLowerCase();
    this.dataSource.filter = value;
  }

  trackByProperty<T>(index: number, column: TableColumn<T>) {
    return column.property;
  }
}
