import {Button, Card, CardActions, CardContent, CardHeader} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import styled from 'styled-components';
import {Feedback} from '../../model/feedback';

const StyledCard = styled(Card)`
    width: 100%;
`;

export const FeedbackCard = ({feedback, onDiscard}: ViewProps) => <StyledCard>
    <CardHeader title={feedback.forName} subheader={`by ${feedback.fromName} on ${feedback.date}`}/>
    <CardContent>
        <Typography variant="body2">{feedback.message}</Typography>
    </CardContent>
    <CardActions>
        <Button size="small" color="secondary" onClick={onDiscard}>
            Discard
        </Button>
    </CardActions>
</StyledCard>;

interface ViewProps {
    feedback: Feedback;
    onDiscard: () => void
}