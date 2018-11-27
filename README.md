
# MaterialAdapter

This is a firestore Timestamp adapter for Angular Materials date picker.

By using this adapter, you can directly display dates from firestore in the material date picker.

Use like this: 

`npm i npm i material-timestamp-adapter`

Then add the module to imports section of your `NgModule`.

## TODO

Currently the library uses Luxon internally to create the adapter, and thus has Luxon as peer dependency. Would probably be better with pure JS date.

