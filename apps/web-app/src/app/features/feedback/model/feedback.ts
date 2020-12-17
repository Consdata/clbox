import {FeedbackComment} from "./feedback-comment";

export interface Feedback {
    id: string;
    from: string;
    fromName: string;
    for: string;
    forName: string;
    date: string;
    message: string;
    comments: FeedbackComment[];
    labels: string[];
}
