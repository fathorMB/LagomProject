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
  wsURL: string;

  constructor() {
    this.apiURL = environment.apiEndpoint;
    this.wsURL = environment.wsEndpoint;
    console.log(this.apiURL);
    console.log(this.wsURL);
  }


  ngOnInit() {}

  ngOnDestroy(): void {}
}
