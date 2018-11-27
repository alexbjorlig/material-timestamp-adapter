import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {
  MatFormFieldModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatInputModule
} from '@angular/material';

import { ReactiveFormsModule} from '@angular/forms';
import { MaterialTimestampAdapterModule } from 'material-timestamp-adapter';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    // Material imports
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    // MatNativeDateModule, // Replaces the native adapter
    MaterialTimestampAdapterModule // Custom Material Timestamp Adapter
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
