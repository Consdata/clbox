import {createReducer} from '@reduxjs/toolkit';
import {ProfileState} from './profile-state';
import {profileStateInitial} from './profile-state-initial';
import {profileFetchedReducer} from './profile-featched.reducer';
import {profileFetched} from './profile-fetched';

export const profileReducer = createReducer<ProfileState>(
    profileStateInitial,
    builder => builder
        .addCase(profileFetched, profileFetchedReducer)
)
