import {
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    createStyles,
    LinearProgress,
    TextField,
    Theme
} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import {Feedback} from '../../model/feedback';
import CommentIcon from '@material-ui/icons/Comment';
import {makeStyles} from "@material-ui/core/styles";
import {grey} from "@material-ui/core/colors";
import {Subject} from 'rxjs';
import {debounceTime, tap} from "rxjs/operators";

const StyledCard = styled(Card)`
    width: 100%;
`;

const Content = styled(Typography)`
    white-space: pre-wrap;
`;

const Filler = styled.div`
    flex: 1;
`;

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        withoutComments: {
            color: grey[500],
        },
        commentsSection: {
            textAlign: 'right',
            display: 'flex',
            flexDirection: 'column'
        },
        commentInput: {
            flex: 1
        },
        commentDraftProgress: {
            height: 2
        }
    }),
);

export const FeedbackCard = ({feedback, onDiscard, onCommentChange}: ViewProps) => {
    const styles = useStyles();
    const hasComments = feedback.comments?.length > 0;
    const [comment, setComment] = useState('');
    const [commentsVisible, setCommentsVisible] = useState(false);
    const [commentDraft, setCommentDraft] = useState(false);
    const [commentText$] = useState(new Subject<string>());
    useEffect(() => {
        const subscription = commentText$
            .pipe(
                tap(msg => setComment(msg)),
                tap(() => !commentDraft && setCommentDraft(true)),
                debounceTime(1000),
            )
            .subscribe(msg => {
                onCommentChange(msg);
                setCommentDraft(false);
            });
        return () => subscription.unsubscribe();
    }, []);
    useEffect(() => setComment(feedback?.comments?.[0]?.text ?? ''), [feedback]);

    return <StyledCard>
        <CardHeader title={feedback.forName} subheader={`by ${feedback.fromName} on ${feedback.date}`}/>
        <CardContent>
            <Content variant="body2">{feedback.message}</Content>
        </CardContent>
        {onDiscard && <CardActions>
            <Button size="small" color="secondary" onClick={onDiscard}>
                Discard
            </Button>
            <Filler/>
            <Button size="small" color="primary" className={!hasComments && styles.withoutComments}
                    onClick={() => setCommentsVisible(!commentsVisible)}>
                <CommentIcon/>
            </Button>
        </CardActions>}
        {commentsVisible && <CardContent className={styles.commentsSection}>
            <TextField
                value={comment}
                className={styles.commentInput}
                multiline
                placeholder={'Add comments'}
                onChange={ev => commentText$.next(ev.target.value)}
            />
            {commentDraft && <LinearProgress className={styles.commentDraftProgress}/>}
        </CardContent>}
    </StyledCard>;
};

interface ViewProps {
    feedback: Feedback;
    onDiscard?: () => void,
    onCommentChange?: (value: string) => void
}
