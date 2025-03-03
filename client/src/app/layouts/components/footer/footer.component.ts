import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'vex-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: true,
  imports: [MatButtonModule, MatIconModule]
})
export class FooterComponent implements OnInit, OnDestroy {

  apiURL: string;

  constructor() {
    this.apiURL = environment.apiEndpoint;
    console.log(this.apiURL);
  }


  ngOnInit() {}

  ngOnDestroy(): void {}
}
