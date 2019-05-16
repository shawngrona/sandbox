// much credit to https://medium.com/@benlesh/learning-observable-by-building-observable-d5da57405d87

const DataSource = require("./dataSource");

/*
 an observable is a 
 1. function
 2. which takes an 'observer' (object / instance of a class)
 3. and returns a function to cancel
*/
function Observable(observer) {
    let datasource = new DataSource(300);
    datasource.next = (e) => observer.next(e);
    datasource.error = (err) => observer.error(err);
    datasource.complete = () => observer.complete();
    return () => {
        datasource.destroy();
    };
}

/*
 purpose?
 1. to connect an observer to something of value (in this case the producer of value is DataSource class)
 2. to return a means to tear down the connection to the producer
*/



// const observer = Observable({
//     next: function (x) {
//         console.log(x);
//     },
//     error(err) {
//         console.error(err);
//     },
//     complete() {
//         console.log("stream completed");
//     }
// });


/*
 this is an instance of the return from the observable
*/
// observer();  // if you execute it, then you're immediately destroying the instance of the data source
//setInterval(observer, 1200); // if you wait some time to execute, then the observer gets some data from the stream then is stopped when observer() is called 1.2 seconds later
