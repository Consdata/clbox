import {Draft} from '@reduxjs/toolkit';
import {ProfileState} from './profile-state';
import {profileFetched} from './profile-fetched';

export const profileFetchedReducer = (state: Draft<ProfileState>, action: ReturnType<typeof profileFetched>) => {
    state.profile = action.payload.profile;
};
