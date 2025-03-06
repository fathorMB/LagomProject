import { Component } from '@angular/core';
import { ProbeSignal } from 'src/app/model/probe-signal';
import { ProbeService } from 'src/app/services/probe.service';

@Component({
  selector: 'vex-probe-signal-state',
  standalone: true,
  imports: [],
  templateUrl: './probe-signal-state.component.html',
  styleUrl: './probe-signal-state.component.scss'
})
export class ProbeSignalStateComponent {
    
  private _probeSignal: ProbeSignal | null = null;
  public get probeSignal(): ProbeSignal | null {
    return this._probeSignal;
  }

  constructor(private _probeService: ProbeService) {}

  ngOnInit(): void {
    this._probeService.startConnection().subscribe(() => {
      this._probeService.receiveProbeSignal().subscribe((probeSignal) => {
        this._probeSignal = probeSignal;
      });
    });
  }
}
