import {CircularProgress} from '@material-ui/core';
import React from 'react';
import {FullScreenCentered} from '../../../layout/full-screen-centered';

export const LoginWait = () => <FullScreenCentered>
    <CircularProgress size={50}/>
</FullScreenCentered>;