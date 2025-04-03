import { Injectable } from '@angular/core';
import { LagomEvent } from '../models/events/lagom-event.model';
import { BusinessServiceResponse } from '../models/common/business-service-response.model';
import { BusinessServiceResponseStatus } from '../models/abstracts/api-response.model';
import { CreateLagomEventResponse } from '../models/events/create-lagom-event-response.model';
import { UpdateLagomEventResponse } from '../models/events/update-lagom-event-response.model';

@Injectable({
  providedIn: 'root'
})
export class LagomEventsService {
  private _seed: LagomEvent[] = [{
    id: 1,
    name: '2 Days Event',
    location: 'Sample Location',
    start: this.buildDate(25, 4, 2025),
    end: this.buildDate(27, 4, 2025)
  }, {
    id: 2,
    name: 'Sample Event',
    location: 'Sample Location',
    start: this.buildDate(15, 5, 2025),
    end: this.buildDate(15, 5, 2025)
  }, {
    id: 3,
    name: 'Sample Event',
    location: 'Sample Location',
    start: this.buildDate(31, 5, 2025),
    end: this.buildDate(2, 6, 2025)
  }];

  getLagomEvents(): LagomEvent[] {
    return this._seed;
  }

  getLagomEventById(id: number): LagomEvent {
    const lagomEvent = this._seed.find((lE) => lE.id === id);
    if (!lagomEvent) { throw new Error(`LagomEvent with id ${id} not found`); }
    return lagomEvent;
  }

  addLagomEvent(lagomEvent: LagomEvent): CreateLagomEventResponse {    
    if (this._seed.some(lE => lE.id === lagomEvent.id)) {
      return this.buildUpdateLagomEventResponse(lagomEvent, BusinessServiceResponseStatus.Error, [`LagomEvent with id ${lagomEvent.id} already present`]);
    } else {    
      this._seed.push(lagomEvent);
      return this.buildCreateLagomEventResponse(lagomEvent, BusinessServiceResponseStatus.Completed, ['LagomEvent created successfully']);
    }
  }

  updateLagomEvent(lagomEvent: LagomEvent): UpdateLagomEventResponse {    
    const index = this._seed.findIndex(lE => lE.id === lagomEvent.id);
    if (index !== -1) {
      this._seed[index] = lagomEvent;
      return this.buildUpdateLagomEventResponse(lagomEvent, BusinessServiceResponseStatus.Completed, ['LagomEvent updated successfully'])
    } else {  
      return this.buildUpdateLagomEventResponse(lagomEvent, BusinessServiceResponseStatus.Error, [`LagomEvent with id ${lagomEvent.id} not found`])
    } 
  }

  deleteLagomEvent(id: number): BusinessServiceResponse {
    this._seed = this._seed.filter(lE => lE.id !== id);
    return this.buildBusinessServiceResponse(BusinessServiceResponseStatus.Completed, ['LagomEvent deleted successfully']);
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
  private buildDate(day: number, month: number, year: number): Date {
    const month0BasedIndex = month - 1;
    return new Date(year, month0BasedIndex, day);
  }
}
