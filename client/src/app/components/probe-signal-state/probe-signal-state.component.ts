import { Component, EventEmitter, inject, Output } from '@angular/core';
import { ProbeSignal } from 'src/app/models/probe-signal.model';
import { ProbeService } from 'src/app/services/probe.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'lagom-probe-signal-state',
  standalone: true,
  providers: [DatePipe],
  imports: [],
  templateUrl: './probe-signal-state.component.html',
  styleUrl: './probe-signal-state.component.scss'
})
export class ProbeSignalStateComponent {
  private readonly probeService = inject(ProbeService);
  private readonly datePipe = inject(DatePipe);

  readonly probeSignalStateErrorMessage: string = "No signal received";
  probeSignalState?: string | null = null;  

  @Output() probeSignalReceived = new EventEmitter<ProbeSignal>();
  @Output() probeSignalErrorReceived = new EventEmitter<string>();

  ngOnInit(): void {
    this.probeService.startConnection().subscribe(() => {
      this.probeService.receiveProbeSignal().subscribe({
        next: (probeSignal) => this.receiveProbeSignal(probeSignal),
        error: (error) => this.receiveProbeSignalError(error)
      });
    });
  }

  private receiveProbeSignal(probeSignal: ProbeSignal): void {
    var serverDateTimeFormatted = '(' + this.datePipe.transform(probeSignal.serverDateTime, 'yyyy-MM-dd HH:mm:ss') + ')';
    this.probeSignalState = 'v' + probeSignal.apiVersion + ' ' + serverDateTimeFormatted;
    this.probeSignalReceived.emit(probeSignal);
  }

  private receiveProbeSignalError(error: string): void {
    this.probeSignalState = this.probeSignalStateErrorMessage;
    this.probeSignalErrorReceived.emit(error);
  }
}
