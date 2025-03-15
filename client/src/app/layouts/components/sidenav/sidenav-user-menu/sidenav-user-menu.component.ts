import { Component, inject, } from '@angular/core';
import { VexPopoverRef } from '@vex/components/vex-popover/vex-popover-ref';
import { MatRippleModule } from '@angular/material/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'vex-sidenav-user-menu',
  templateUrl: './sidenav-user-menu.component.html',
  styleUrls: ['./sidenav-user-menu.component.scss'],
  imports: [MatRippleModule, RouterLink, MatIconModule],
  standalone: true
})
export class SidenavUserMenuComponent {
  private readonly popoverRef = inject(VexPopoverRef);
  private readonly authService = inject(AuthService);

  signOut(): void {
    /** Clear local storage data */
    this.authService.logout();
    
    this.close();
  }

  close(): void {
    /** Wait for animation to complete and then close */
    setTimeout(() => this.popoverRef.close(), 250);    
  }
}
