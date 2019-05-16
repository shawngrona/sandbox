const NumberPrinterColdObservable = require("./safe");

/*
 'cold' observable
 An observable is cold if the producer of its notifications is created whenever an observer subscribes to the observable. For example, a timer observable is cold; each time a subscription is made, a new timer is created.
*/
const myNumPrintObservable = new NumberPrinterColdObservable();
const subscription1 = myNumPrintObservable.subscribe(data => {
    console.log("(observable1) value = " + data);
},
err => {
    console.error(err);
});

// const subscription2 = myNumPrintObservable.subscribe(data => {
//     console.log("(observable2) value = " + data);
// },
// err => {
//     console.error(err);
// });


// setTimeout(() => {subscription1.unsubscribe()}, 1100);
setTimeout(() =>{
    const myNumPrintObservable2 = new NumberPrinterColdObservable();
    const subscription2 = myNumPrintObservable2.subscribe(data => {
        console.log("(observable2) value = " + data);
    },
    err => {
        console.error(err);
    });
}, 1000) 

/* 
 what is a hot observable? 
 An observable is hot if the producer of its notifications is not created each time an observer subscribes to the observable. For example, an observable created using fromEvent is hot; the element that produces the events exists in the DOM — it’s not created when the observer is subscribed.
 what is a subject?
 ...next time

*/
