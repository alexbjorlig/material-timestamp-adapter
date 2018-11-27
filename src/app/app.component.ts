import { Component } from '@angular/core';
import {FormControl} from '@angular/forms';
import {firestore} from 'firebase';

// firestore.Timestamp

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  date = new FormControl();

  constructor() {
    const createNewTimestamp = new firestore.Timestamp(new Date('2018-02-02').getTime() / 1000, 0);

    this.date.setValue(createNewTimestamp);

  }
}
