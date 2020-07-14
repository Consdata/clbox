import {TypedUseSelectorHook, useSelector} from 'react-redux';
import {AppState} from './app-state';

export const useStateSelector: TypedUseSelectorHook<AppState> = useSelector;