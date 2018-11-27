import { NgModule } from '@angular/core';

import {
  DateAdapter,
  MAT_DATE_LOCALE,
  MAT_DATE_FORMATS
} from '@angular/material';
import {TimestampDateAdapter} from './material-timestamp-date-adapter';
import {MAT_TIMESTAMP_DATE_FORMATS} from './material-timestamp-date-formats';

export * from './material-timestamp-date-adapter';
export * from './material-timestamp-date-formats';

@NgModule({
  providers: [
    {provide: DateAdapter, useClass: TimestampDateAdapter, deps: [MAT_DATE_LOCALE]}
  ],
})
export class TimestampDateModule {}

@NgModule({
  imports: [TimestampDateModule],
  providers: [{provide: MAT_DATE_FORMATS, useValue: MAT_TIMESTAMP_DATE_FORMATS}],
})
export class MaterialTimestampAdapterModule {}
