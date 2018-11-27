import {MatDateFormats} from '@angular/material';


export const MAT_TIMESTAMP_DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: 'D',
  },
  display: {
    dateInput: 'D',
    monthYearLabel: 'MMM yyyy',
    dateA11yLabel: 'DD',
    monthYearA11yLabel: 'MMMM yyyy',
  },
};
// See format here: https://moment.github.io/luxon/docs/manual/formatting.html
