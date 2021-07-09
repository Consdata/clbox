import {SurveyAnswerType} from './survey-answer-type';

export interface SurveyQuestion {
    id: string;
    text: {
        main: string;
        category: string;
    };
    answers: {
        type: SurveyAnswerType;
        min: {
            value: number,
            text?: string
        },
        max: {
            value: number,
            text?: string
        }
    };
}
