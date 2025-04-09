import { APIResponse } from "../abstracts/api-response.model";
import { LagomEvent } from "./lagom-event.model";

export interface UpdateLagomEventResponse extends APIResponse {
    lagomEvent: LagomEvent;
}