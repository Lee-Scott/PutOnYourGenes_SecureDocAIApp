import { IQuestionnaire } from "./IQuestionnaire";
import { IQuestionnaireResponse } from "./IQuestionnaireResponse";

export interface IResponse<T> {
    time: string;
    code: number;
    path: string;
    status: string; // enum in backend
    message: string;
    data: T; // replaced with actual type
    timeStamp?: string;
}

export interface IRawResponse {
    status: string;
    data: {
        questionnaire?: IQuestionnaire;
        response?: IQuestionnaireResponse;
        responses?: IQuestionnaireResponse[];
        analytics?: Record<string, unknown>;
    };
    message: string;
    time: string;
    code?: number;
    path?: string;
}