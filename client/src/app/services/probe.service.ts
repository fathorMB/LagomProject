import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ProbeSignal } from '../models/common/probe-signal.model';

@Injectable({
  providedIn: 'root'
})
export class ProbeService {
  private hubConnection: signalR.HubConnection;

  constructor() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(environment.wsEndpoint + '/probeHub') // SignalR hub URL
      .build();
  }

  startConnection(): Observable<void> {
    return new Observable<void>((observer) => {
      this.hubConnection
        .start()
        .then(() => {
          console.log('Connection established with SignalR hub');
          observer.next();
          observer.complete();
        })
        .catch((error) => {
          console.error('Error connecting to SignalR hub:', error);
          observer.error(error);
        });
    });
  }

  closeConnection(): void {
    this.hubConnection.stop();
  }

  receiveProbeSignal(): Observable<ProbeSignal> {
    return new Observable<ProbeSignal>((observer) => {
      this.hubConnection.on('ReceiveProbeSignal', (probeSignal: ProbeSignal) => {
        observer.next(probeSignal);
      });
    });
  }
}
