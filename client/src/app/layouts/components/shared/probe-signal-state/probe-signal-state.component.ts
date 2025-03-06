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
    
  private _probeSignal: ProbeSignal | null = null;
  
  public get isProbeSignalActive(): boolean {
    return this._probeSignal != null;
  }
  public get probeSignalState(): string {
    return this._probeSignal ? this._probeSignal.apiVersion + " - " + this._probeSignal.serverDateTime : "No signal received";
  }

  constructor(private _probeService: ProbeService) {}

  ngOnInit(): void {
    this._probeService.startConnection().subscribe(() => {
      this._probeService.receiveProbeSignal().subscribe({
        next: this.recieveProbeSignal,
        error: this.handleProbeSignalError
      });
    });
  }

  private recieveProbeSignal(probeSignal: ProbeSignal): void {
    this._probeSignal = probeSignal;
  }

  private handleProbeSignalError(error: string): void {
    this._probeSignal = null;
  }
}
