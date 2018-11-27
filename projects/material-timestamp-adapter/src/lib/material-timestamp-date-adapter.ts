import { Inject, Injectable, Optional } from '@angular/core';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material';
import { DateTime, Info } from 'luxon';
import { firestore } from 'firebase/app';

/** Creates an array and fills it with values. */
function range<T>(length: number, valueFunction: (index: number) => T): T[] {
    const valuesArray = Array(length);
    for (let i = 0; i < length; i++) {
        valuesArray[i] = valueFunction(i);
    }
    return valuesArray;
}

/** Adapts Luxon DateTime for use with Angular Material. */
@Injectable()
export class TimestampDateAdapter extends DateAdapter<firestore.Timestamp> {
    private _localeData: {
        firstDayOfWeek: number,
        longMonths: string[],
        shortMonths: string[],
        narrowMonths: string[],
        dates: string[],
        longDaysOfWeek: string[],
        shortDaysOfWeek: string[],
        narrowDaysOfWeek: string[]
    };

    constructor(@Optional() @Inject(MAT_DATE_LOCALE) dateLocale: string) {
        super();
        this.setLocale(dateLocale || DateTime.local().locale);
    }

    setLocale(locale: string) {
        super.setLocale(locale);

        this._localeData = {
            firstDayOfWeek: 0, // momentLocaleData.firstDayOfWeek(), // 0-6 (Sunday to Saturday)
            longMonths: Info.months('long', { locale }),
            shortMonths: Info.months('short', { locale }),
            narrowMonths: Info.months('narrow', { locale }),
            dates: range(31, (i) => {
                const asTimestamp = this.createDate(2017, 0, i + 1);
                const asLuxon = this.convertToLuxon(asTimestamp);
                return asLuxon.toFormat('d');
            }),
            longDaysOfWeek: Info.weekdays('long', { locale }),
            shortDaysOfWeek: Info.weekdays('short', { locale }),
            narrowDaysOfWeek: Info.weekdays('narrow', { locale }) // momentLocaleData.weekdaysMin(),
        };
    }

    convertToLuxon(date: firestore.Timestamp): DateTime {
        const asJsDate = date.toDate();
        const asLuxon = DateTime.fromJSDate(asJsDate);
        return asLuxon.setLocale(this.locale);
    }

    convertToTimestamp(date: DateTime): firestore.Timestamp {
        const asJsDate = date.toJSDate();
        const timestamp = firestore.Timestamp.fromDate(asJsDate);
        return timestamp;
    }

    clone(date: firestore.Timestamp): firestore.Timestamp {
        return date;
    }

    getYear(date: firestore.Timestamp): number {
        const asLuxon = this.convertToLuxon(date);
        return asLuxon.year;
    }

    getMonth(date: firestore.Timestamp): number {
        const asLuxon = this.convertToLuxon(date);
        return asLuxon.month - 1;
    }

    getDate(date: firestore.Timestamp): number {
        const asLuxon = this.convertToLuxon(date);
        return asLuxon.day;
    }

    getDayOfWeek(date: firestore.Timestamp): number {
        const asLuxon = this.convertToLuxon(date);
        return asLuxon.weekday;
    }

    getMonthNames(style: 'long' | 'short' | 'narrow'): string[] {
        return this._localeData[`${style}Months`];
    }

    getDateNames(): string[] {
        return this._localeData.dates;
    }

    getDayOfWeekNames(style: 'long' | 'short' | 'narrow'): string[] {
        if (style === 'long') {
            return this._localeData.longDaysOfWeek;
        }
        if (style === 'short') {
            return this._localeData.shortDaysOfWeek;
        }
        return this._localeData.narrowDaysOfWeek;
    }

    getYearName(date: firestore.Timestamp): string {
        const asLuxon = this.convertToLuxon(date);
        return asLuxon.toFormat('yyyy');
    }

    getFirstDayOfWeek(): number {
        return this._localeData.firstDayOfWeek;
    }

    getNumDaysInMonth(date: firestore.Timestamp): number {
        const asLuxon = this.convertToLuxon(date);
        return asLuxon.daysInMonth;
    }

    createDate(year: number, month: number, date: number): firestore.Timestamp {
        // Luxon will create an invalid date if any of the components are out of bounds, but we
        // explicitly check each case so we can throw more descriptive errors.
        if (month < 0 || month > 11) {
            throw Error(`Invalid month index "${month}". Month index has to be between 0 and 11.`);
        }

        if (date < 1) {
            throw Error(`Invalid date "${date}". Date has to be greater than 0.`);
        }
        // const result = DateTime({year, month, date}).locale(this.locale);
        const result = DateTime.fromObject({ year, month: month + 1, day: date }).setLocale(this.locale);

        // If the result isn't valid, the date must have been out of bounds for this month.
        if (!result.isValid) {
            throw Error(`Invalid date "${date}" for month with index "${month}".`);
        }
        const asTimestamp = this.convertToTimestamp(result);
        return asTimestamp;
    }

    today(): firestore.Timestamp {
        const date = DateTime.local().setLocale(this.locale);
        const asTimeStamp = this.convertToTimestamp(date);
        return asTimeStamp;
    }
    // See this list, for table of tokens https://moment.github.io/luxon/docs/manual/parsing.html
    parse(value: any, parseFormat: string | string[]): firestore.Timestamp | null {
        if (value && typeof value === 'string') {
            const asLuxon = DateTime.fromFormat(value, (parseFormat as string), { locale: this.locale });
            const asTimestamp = this.convertToTimestamp(asLuxon);
            return asTimestamp;
        }
        const returnValueAsLuxon = DateTime.fromObject(value).setLocale(this.locale);
        const returnValueAsTimestamp = this.convertToTimestamp(returnValueAsLuxon);
        return value ? returnValueAsTimestamp : null;
    }

    format(date: firestore.Timestamp, displayFormat: string): string {
        if (!this.isValid(date)) {
            throw Error('LuxonDateAdapter: Cannot format invalid date.');
        }
        const asLuxon = this.convertToLuxon(date);
        return asLuxon.toFormat(displayFormat);
    }

    addCalendarYears(date: firestore.Timestamp, years: number): firestore.Timestamp {
        const asLuxon = this.convertToLuxon(date);
        const addedYears = asLuxon.plus({years});
        const asTimestamp = this.convertToTimestamp(addedYears);
        return asTimestamp;
    }

    addCalendarMonths(date: firestore.Timestamp, months: number): firestore.Timestamp {
        const asLuxon = this.convertToLuxon(date);
        const addedMonths = asLuxon.plus({months});
        const asTimestamp = this.convertToTimestamp(addedMonths);
        return asTimestamp;
    }

    addCalendarDays(date: firestore.Timestamp, days: number): firestore.Timestamp {
        const asLuxon = this.convertToLuxon(date);
        const addedDays = asLuxon.plus({days});
        const asTimestamp = this.convertToTimestamp(addedDays);
        return asTimestamp;
    }

    toIso8601(date: firestore.Timestamp): string {
        const asLuxon = this.convertToLuxon(date);
        return asLuxon.toISO();
    }

    isFirestoreTimeStamp(object: object): boolean {
        try {
            // If this is not an object, lets return straight away
            if (typeof object !== 'object') {
                return false;
            }
            const objectAsTimestamp = object as firestore.Timestamp;
            // We can identify a firestore Timestamp object, by containing a seconds and nanoSeconds property
            const seconds: boolean = typeof objectAsTimestamp.seconds === 'number';
            const nanoSeconds: boolean = typeof objectAsTimestamp.nanoseconds === 'number';
            const asDate: boolean = (objectAsTimestamp.toDate() instanceof Date);
            return (seconds && nanoSeconds && asDate) ? true : false;
        } catch (error) {
            return false;
        }
    }

    /**
     * Returns the given value if given a valid Luxon or null. Deserializes valid ISO 8601 strings
     * (https://www.ietf.org/rfc/rfc3339.txt) and valid Date objects into valid Luxon's and empty
     * string into null. Returns an invalid date for all other values.
     */
    deserialize(value: any): firestore.Timestamp | null {
        let date;
        if (value instanceof Date) {
            const asLuxon = DateTime.fromJSDate(value);
            date = this.convertToTimestamp(asLuxon);
        }
        if (typeof value === 'string') {
            if (!value) {
                return null;
            }
            const asLuxon = DateTime.fromISO(value, { locale: this.locale });
            date = this.convertToTimestamp(asLuxon);
        }
        if (date && this.isValid(date)) {
            return date;
        }
        return super.deserialize(value);
    }

    isDateInstance(obj: any): boolean {
        try {
            const asJsDate = (obj as firestore.Timestamp).toDate();
            // const luxonObject = DateTime.fromObject(obj);
            const luxonObject = DateTime.fromJSDate(asJsDate);
            return luxonObject.isValid;
        } catch (error) {
            return false;
        }
    }

    isValid(date: firestore.Timestamp): boolean {
        const asLuxon = this.convertToLuxon(date);
        return asLuxon.isValid;
    }

    invalid(): firestore.Timestamp {
        return firestore.Timestamp.now();
    }
}
