const DataSource = require("./dataSource");
console.clear();
/*
  why safe? 
  1. If you pass an Observer doesn’t have all of the methods implemented, that’s okay.
  2. You don’t want to call `next` after a `complete` or an `error`
  3. You don’t want anything called if you’ve unsubscribed.
  4. Calls to `complete` and `error` need to call unsubscription logic.
  5. If your `next`, `complete` or `error` handler throws an exception, you want to call your unsubscription logic so you don’t leak resources.
  (`next`, `error` and `complete` are all actually optional. You don’t have to handle every value, or errors or completions. You might just want to handle one or two of those things.)
*/

class SafeObserver {
  constructor(destination) {
    this.destination = destination;
  }
  
  next(value) {
    // only try to next if you're subscribed have a handler
    if (!this.isUnsubscribed && this.destination.next) {
      try {
        this.destination.next(value);
      } catch (err) {
        console.log("CAUGHT on NEXT!");
        // if the provided handler errors, teardown resources, then throw
        this.unsubscribe();
        throw err;
      }
    }
  }
  
  error(err) {
    // only try to emit error if you're subscribed and have a handler
    if (!this.isUnsubscribed && this.destination.error) {
      try {
        this.destination.error(err);
      } catch (e2) {
        
        // if the provided handler errors, teardown resources, then throw
        this.unsubscribe();
        throw e2;
      }
      this.unsubscribe();
    }
  }

  complete() {
    // only try to emit completion if you're subscribed and have a handler
    if (!this.isUnsubscribed && this.destination.complete) {
      try {
        this.destination.complete();
      } catch (err) {
        // if the provided handler errors, teardown resources, then throw
        this.unsubscribe();
        throw err;
      }
      this.unsubscribe();
    }
  }
  
  unsubscribe() {
    this.isUnsubscribed = true;
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }
}

// the observable (function that takes an object and returns a method of cancelation)
function myObservable(observer) {
  const safeObserver = new SafeObserver(observer);
  const datasource = new DataSource(300);
  datasource.next = (e) => safeObserver.next(e);
  datasource.error = (err) => safeObserver.error(err);
  datasource.complete = () => safeObserver.complete();

  safeObserver.unsubscribe = () => {
    datasource.destroy();
  };

  return safeObserver.unsubscribe.bind(safeObserver);
}


// const observer = myObservable({
//   next(x) { console.log(x); },
//   error(err) { console.error(err); },
//   complete() { console.log('done')}
// });








class NumberPrinterColdObservable { 
  
  constructor(){
    this.observer = undefined;
  }

  subscribe(data, err){
    this.observer = new SafeObserver({next: data, error: err});
    const datasource = new DataSource(300);
    datasource.next = (e) => this.observer.next(e);
    datasource.error = (err) => this.observer.error(err);
    datasource.complete = () => this.observer.complete();
    return this;
  }
  unsubscribe(){
    this.datasource.destroy();
  }
}
module.exports = NumberPrinterColdObservable;
