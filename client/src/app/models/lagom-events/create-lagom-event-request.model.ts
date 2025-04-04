import { APIRequest } from "../abstracts/api-request.model";
import { LagomEvent } from "./lagom-event.model";

export interface CreateLagomEventRequest extends APIRequest {
    lagomEvent: LagomEvent;
}