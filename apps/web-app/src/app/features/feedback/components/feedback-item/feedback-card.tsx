import {
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Chip,
    Collapse,
    createStyles,
    IconButton,
    LinearProgress, ListItemIcon, ListItemText,
    Menu,
    MenuItem,
    TextField,
    Theme
} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Autocomplete from '@material-ui/lab/Autocomplete';
import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import {Feedback} from '../../model/feedback';
import CommentIcon from '@material-ui/icons/Comment';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import MoreVertIcon from '@material-ui/icons/MoreVert';
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

const HeaderWrapper = styled.div`
    display: flex;
    padding-right: 8px
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
        },
        labelsInput: {
            marginLeft: 8,
            minWidth: 300
        },
        menuItemDanger: {
            color: theme.palette.secondary.main
        }
    }),
);

export const FeedbackCard = ({feedback, existingLabels, onDiscard, onCommentChange, onLabelsChange}: ViewProps) => {
    const styles = useStyles();
    const hasComments = feedback.comments?.length > 0;
    const [comment, setComment] = useState('');
    const [labels, setLabels] = useState([]);
    const [commentsVisible, setCommentsVisible] = useState(false);
    const [commentDraft, setCommentDraft] = useState(false);
    const [commentText$] = useState(new Subject<string>());
    const [headerMenuAnchorEl, setHeaderMenuAnchorEl] = useState(undefined);
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
    useEffect(() => setLabels(feedback?.labels ?? []), [feedback]);
    const onLabelsAutocompleteChange = (_, labels) => {
        setLabels(labels);
        onLabelsChange(labels);
    };

    return <StyledCard>
        <CardHeader
            title={feedback.forName}
            subheader={`by ${feedback.fromName} on ${feedback.date}`}
            action={
                <IconButton onClick={ev => setHeaderMenuAnchorEl(ev.currentTarget)}>
                    <MoreVertIcon/>
                </IconButton>
            }
        />
        <Menu
            anchorEl={headerMenuAnchorEl}
            open={Boolean(headerMenuAnchorEl)}
            onClose={() => setHeaderMenuAnchorEl(undefined)}
        >
            <MenuItem onClick={onDiscard} className={styles.menuItemDanger}>
                <ListItemIcon>
                    <DeleteForeverIcon color={"secondary"} />
                </ListItemIcon>
                <ListItemText primary="Discard" />
            </MenuItem>
        </Menu>
        <CardContent>
            <Content variant="body2">{feedback.message}</Content>
        </CardContent>
        {onDiscard && <CardActions>
            <Autocomplete
                multiple
                options={existingLabels ?? []}
                value={labels}
                freeSolo
                disableClearable
                onChange={onLabelsAutocompleteChange}
                renderTags={(value: string[], getTagProps) =>
                    value.map((option: string, index: number) => (
                        <Chip variant="outlined" label={option} {...getTagProps({index})} />
                    ))
                }
                renderInput={(params) => (
                    <TextField
                        {...params}
                        variant="standard"
                        placeholder={labels.length == 0 ? 'Labels' : undefined}
                        InputProps={{...params.InputProps, disableUnderline: true}}
                        className={styles.labelsInput}
                    />
                )}
            />
            <Filler/>
            {/*<Button size="small" color="secondary" onClick={onDiscard}>*/}
            {/*    <DeleteForeverIcon/>*/}
            {/*</Button>*/}
            <Button size="small" color="primary" className={!hasComments ? styles.withoutComments : ''}
                    onClick={() => setCommentsVisible(!commentsVisible)}>
                <CommentIcon/>
            </Button>
        </CardActions>}
        <Collapse in={commentsVisible} timeout="auto" unmountOnExit>
            <CardContent className={styles.commentsSection}>
                <TextField
                    value={comment}
                    className={styles.commentInput}
                    multiline
                    placeholder={'Add comments'}
                    onChange={ev => commentText$.next(ev.target.value)}
                />
                {commentDraft && <LinearProgress className={styles.commentDraftProgress}/>}
            </CardContent>
        </Collapse>
    </StyledCard>;
};

interface ViewProps {
    feedback: Feedback;
    existingLabels: string[];
    onDiscard?: () => void,
    onCommentChange?: (value: string) => void
    onLabelsChange?: (value: string[]) => void
}
