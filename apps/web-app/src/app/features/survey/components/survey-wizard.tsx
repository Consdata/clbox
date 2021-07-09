import React, {useEffect, useState} from 'react';
import {connect, ConnectedProps} from 'react-redux';
import {useParams} from 'react-router';
import {AppState} from '../../../state/app-state';
import {firebaseApp} from '../../firebase/firebase.app';
import {Survey} from '../model/survey';

function fetchSurveyCallback(fetchSurvey, uuid: string, setSurvey: (value: (((prevState: Survey) => Survey) | Survey)) => void) {
    return () => {
        const abort = new AbortController();
        fetchSurvey(uuid)?.then(survey => {
            if (!abort.signal.aborted) {
                setSurvey(survey?.data() as Survey);
            }
        })
        return () => abort.abort();
    };
}

const SurveyView = ({fetchSurvey}: ViewProps) => {
    const {uuid} = useParams<{ uuid: string }>();
    const [survey, setSurvey] = useState<Survey>(undefined);
    useEffect(fetchSurveyCallback(fetchSurvey, uuid, setSurvey), [uuid, fetchSurvey]);
    return survey ? <div><pre>{JSON.stringify(survey, undefined, 2)}</pre></div> : <div>loading...</div>;
};

interface ViewProps extends ConnectedProps
    <typeof connector> {
}

const connector = connect(
    (state: AppState) => ({
        fetchSurvey:
            state.team.current
                ? (uuid: string) => firebaseApp.firestore()
                    .collection(`team/${state.team.current.id}/survey`)
                    .doc(uuid)
                    .get()
                : () => undefined
    }),
    {}
);

export const SurveyWizard = connector(SurveyView);
