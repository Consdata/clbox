import {rootReducer} from '../store/root-reducer';

export type AppState = ReturnType<ReturnType<typeof rootReducer>>;