import {createReducer} from '@reduxjs/toolkit';
import {ChapterStatsState} from './chapter-stats-state';
import {chapterStatsStateInitial} from './chapter-stats-state-initial';

export const chapterStatsReducer = createReducer<ChapterStatsState>(
  chapterStatsStateInitial,
  builder => builder
)
