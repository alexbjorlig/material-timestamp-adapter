
# MaterialAdapter

This is a firestore Timestamp adapter for Angular Materials date picker.

By using this adapter, you can directly display dates from firestore in the material date picker.

Use like this: 

 1) `npm i material-timestamp-adapter`

 2) Then add the module to imports section of your `NgModule`:

```typescript
import { MaterialTimestampAdapterModule } from 'material-timestamp-adapter';

@NgModule({
declarations: [AppComponent],
imports: [MaterialTimestampAdapterModule],
providers: [],
bootstrap: [AppComponent]
})
export class AppModule { }
```

## TODO

Currently the library uses Luxon internally to create the adapter, and thus has Luxon as peer dependency. Would probably be better with pure JS date.

## Run locally

1) Pull the library
2) `npm i`
3) `ng build material-timestamp-adapter`
4) `ng s`
5) Open your browser on `http://localhost:4200`