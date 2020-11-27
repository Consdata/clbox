import {createAction} from '@reduxjs/toolkit';
import {Profile} from './profile';

export interface ProfileFetchedPayload {
    profile: Profile
}

export const profileFetched = createAction<ProfileFetchedPayload>('ProfileFetched');
