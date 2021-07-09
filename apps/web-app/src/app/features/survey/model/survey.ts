import {SurveyQuestion} from './survey-question';

export interface Survey {
    id: string;
    forUser: string;
    questions: SurveyQuestion[];
}
