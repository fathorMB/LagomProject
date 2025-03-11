import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { ProbeSignal } from 'src/app/models/probe-signal.model';
import { ProbeService } from 'src/app/services/probe.service';

@Component({
  selector: 'lagom-probe-signal-state',
  standalone: true,
  providers: [DatePipe],
  imports: [],
  templateUrl: './probe-signal-state.component.html',
  styleUrl: './probe-signal-state.component.scss'
})
export class ProbeSignalStateComponent {
  readonly probeSignalStateErrorMessage: string;
  probeSignalState: string | null;

  @Output() probeSignalReceived = new EventEmitter<ProbeSignal>();
  @Output() probeSignalErrorReceived = new EventEmitter<string>();

  constructor(private _probeService: ProbeService, private _datePipe: DatePipe) {
    this.probeSignalStateErrorMessage = "No signal received";
    this.probeSignalState = null;
  }

  ngOnInit(): void {
    this._probeService.startConnection().subscribe(() => {
      this._probeService.receiveProbeSignal().subscribe({
        next: (probeSignal) => this.receiveProbeSignal(probeSignal),
        error: (error) => this.receiveProbeSignalError(error)
      });
    });
  }

  private receiveProbeSignal(probeSignal: ProbeSignal): void {
    var serverDateTimeFormatted = '(' + this._datePipe.transform(probeSignal.serverDateTime, 'yyyy-MM-dd HH:mm:ss') + ')';
    this.probeSignalState = 'v' + probeSignal.apiVersion + ' ' + serverDateTimeFormatted;
    this.probeSignalReceived.emit(probeSignal);
  }

  private receiveProbeSignalError(error: string): void {
    this.probeSignalState = this.probeSignalStateErrorMessage;
    this.probeSignalErrorReceived.emit(error);
  }
}
