export interface APIResponse {
    requestId: string;
    responseId: string;
    businessServiceStatus: BusinessServiceResponseStatus;
    businessServiceMessages: string[];
}

export enum BusinessServiceResponseStatus {
    Completed,
    CompletedWithErrors,
    Error,
    Unknown
}