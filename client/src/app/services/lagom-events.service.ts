import { Injectable } from '@angular/core';
import { LagomEvent } from '../models/lagom-events/lagom-event.model';
import { BusinessServiceResponse } from '../models/common/business-service-response.model';
import { BusinessServiceResponseStatus } from '../models/abstracts/api-response.model';
import { CreateLagomEventResponse } from '../models/lagom-events/create-lagom-event-response.model';
import { UpdateLagomEventResponse } from '../models/lagom-events/update-lagom-event-response.model';
import { delay, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LagomEventsService {
  /* Seed mock data, to be removed when API calls will be integrated */
  private _seed: LagomEvent[] = [{
    id: 1,
    name: '2 Days Event',
    location: 'Sample Location',
    start: this.buildDate(25, 4, 2025),
    end: this.buildDate(26, 4, 2025)
  }, {
    id: 2,
    name: 'Sample Event',
    location: 'Sample Location',
    start: this.buildDate(15, 5, 2025),
    end: this.buildDate(15, 5, 2025)
  }, {
    id: 3,
    name: '3 Days Event',
    location: 'Sample Location',
    start: this.buildDate(31, 5, 2025),
    end: this.buildDate(2, 6, 2025)
  }];

  getLagomEvents(): Observable<LagomEvent[]> { return of(this._seed).pipe(delay(500)); }

  addLagomEvent(event: LagomEvent): Observable<CreateLagomEventResponse> {
    const exists = this._seed.find(e => e.id === event.id);
    if (exists) { return of(this.buildCreateLagomEventResponse(event, BusinessServiceResponseStatus.Error, [`LagomEvent with id ${event.id} already exists`])).pipe(delay(300)); } 
    else {
      this._seed.push(event);
      return of(this.buildCreateLagomEventResponse(event, BusinessServiceResponseStatus.Completed, ['Event created successfully'])).pipe(delay(300));
    }        
  }

  updateLagomEvent(event: LagomEvent): Observable<UpdateLagomEventResponse> {
    const index = this._seed.findIndex(e => e.id === event.id);
    if (index !== -1) {
      this._seed[index] = event;
      return of(this.buildUpdateLagomEventResponse(event, BusinessServiceResponseStatus.Completed, ['LagomEvent updated successfully'])).pipe(delay(300));
    } else { return of(this.buildUpdateLagomEventResponse(event, BusinessServiceResponseStatus.Error, [`LagomEvent with id ${event.id} not found`])).pipe(delay(300)); }
  }

  deleteLagomEvent(id: number): Observable<BusinessServiceResponse> {
    this._seed = this._seed.filter(lE => lE.id !== id);    
    return of(this.buildBusinessServiceResponse(BusinessServiceResponseStatus.Completed, ['LagomEvent deleted successfully'])).pipe(delay(300));
  }    

  /* Utility functions, to be removed when API calls will be integrated */
  private buildDate(day: number, month: number, year: number): Date {
    const month0BasedIndex = month - 1;
    return new Date(year, month0BasedIndex, day);
  }
  private buildCreateLagomEventResponse(lagomEvent: LagomEvent, status: BusinessServiceResponseStatus, messages: string[]): CreateLagomEventResponse {
    return {
      lagomEvent: lagomEvent,
      requestId: 'some-request-id',
      responseId: 'some-response-id',
      businessServiceStatus: status,
      businessServiceMessages: messages
    };
  }
  private buildUpdateLagomEventResponse(lagomEvent: LagomEvent, status: BusinessServiceResponseStatus, messages: string[]): UpdateLagomEventResponse {
    return {
      lagomEvent: lagomEvent,
      requestId: 'some-request-id',
      responseId: 'some-response-id',
      businessServiceStatus: status,
      businessServiceMessages: messages
    };
  }
  private buildBusinessServiceResponse(status: BusinessServiceResponseStatus, messages: string[]): BusinessServiceResponse {
    return {
      requestId: 'some-request-id',
      responseId: 'some-response-id',
      businessServiceStatus: status,
      businessServiceMessages: messages
    };
  }  
}
