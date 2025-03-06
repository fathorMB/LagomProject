import { Component } from '@angular/core';
import { ProbeSignal } from 'src/app/model/probe-signal';
import { ProbeService } from 'src/app/services/probe.service';

@Component({
  selector: 'lagom-probe-signal-state',
  standalone: true,
  imports: [],
  templateUrl: './probe-signal-state.component.html',
  styleUrl: './probe-signal-state.component.scss'
})
export class ProbeSignalStateComponent {
    
  readonly probeSignalStateErrorMessage: string;
  probeSignalState: string;

  constructor(private _probeService: ProbeService) {
    this.probeSignalStateErrorMessage = "No signal received";
    this.probeSignalState = this.probeSignalStateErrorMessage;
  }

  ngOnInit(): void {
    this._probeService.startConnection().subscribe(() => {
      this._probeService.receiveProbeSignal().subscribe({
        next: this.recieveProbeSignal,
        error: this.handleProbeSignalError
      });
    });
  }

  private recieveProbeSignal(probeSignal: ProbeSignal): void {
    this.probeSignalState = probeSignal.apiVersion + " - " + probeSignal.serverDateTime;
  }

  private handleProbeSignalError(error: string): void {
    this.probeSignalState = this.probeSignalStateErrorMessage;
  }
}
