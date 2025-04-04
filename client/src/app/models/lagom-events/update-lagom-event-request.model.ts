import { APIRequest } from "../abstracts/api-request.model";
import { LagomEvent } from "./lagom-event.model";

export interface UpdateLagomEventRequest extends APIRequest {
    lagomEvent: LagomEvent;
}