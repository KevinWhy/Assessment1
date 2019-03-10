# Assessment1
This is a coding assessment with two parts:
1. A simple REST API in Java
2. An Angular GUI (connected to the Github Issues API)

## REST API
The API defines a simple notes collection with CRUD (Create, Read, Update, Delete) operations.
Users can also see notes that contain a case-insensitive string by adding a query parameter: "query" onto the notes endpoint.

### API Example
`localhost/api/notes/?query=Milk` displays all the notes that contain "Milk". Since it's case-insensitive, "milk" or "mILk" will work as well.

## Angular GUI
Uses the Github Issues API to display all the issues in the [Angular Github repo](https://github.com/angular/angular).
