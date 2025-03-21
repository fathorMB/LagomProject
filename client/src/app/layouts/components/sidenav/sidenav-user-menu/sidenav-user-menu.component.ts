import { Component, inject, Input, OnInit, } from '@angular/core';
import { VexPopoverRef } from '@vex/components/vex-popover/vex-popover-ref';
import { MatRippleModule } from '@angular/material/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/users/user.model';
import { UsersService } from 'src/app/services/users.service';
import { MatDialog } from '@angular/material/dialog';
import { ChangePasswordComponent } from 'src/app/components/change-password/change-password.component';
import { BusinessServiceResponse } from 'src/app/models/common/business-service-response.model';

@Component({
  selector: 'vex-sidenav-user-menu',
  templateUrl: './sidenav-user-menu.component.html',
  styleUrls: ['./sidenav-user-menu.component.scss'],
  imports: [MatRippleModule, RouterLink, MatIconModule],
  standalone: true
})
export class SidenavUserMenuComponent implements OnInit {
  private readonly popoverRef = inject(VexPopoverRef);
  private readonly authService = inject(AuthService);
  private readonly usersService = inject(UsersService);
  private readonly dialog: MatDialog = inject(MatDialog);

  private user!: User;

  ngOnInit(): void {
    this.user = this.popoverRef.data;
  }

  signOut(): void {
    this.authService.logout();    
    this.close();
  }

  changePassword(): void {
    this.dialog
      .open(ChangePasswordComponent, { data: this.user })
      .afterClosed()
      .subscribe((newPassword: string) => {
        // NewPassword is the new created password (if the user pressed Save - otherwise it's null)
        if (newPassword) {
          this.usersService
            .changePassword(this.user.id, newPassword)
            .subscribe((businessServiceResponse: BusinessServiceResponse) => {
              console.log('password changed for user ' + this.user.username);
            });
        }
      });
    this.close();
  }

  close(): void {    
    setTimeout(() => this.popoverRef.close(), 250);   // Wait for animation to complete and then close
  }
}
