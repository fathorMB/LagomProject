import { APIResponse } from "../abstracts/api-response.model";
import { LagomEvent } from "./lagom-event.model";

export interface CreateLagomEventResponse extends APIResponse {
    lagomEvent: LagomEvent;
}