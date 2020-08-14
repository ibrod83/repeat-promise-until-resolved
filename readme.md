A utility for easily repeating a promise-based task, until it succeeds. Works both in Node and in the browser.

## Installation

```sh
$ npm install repeat-promise-until-resolved
```
# Table of Contents
- [Examples](#examples)
  * [Usage](#usage)       
  * [Basic example](#basic-example)  
  * [Additional configuration](#additional-configuration)  
- [API](#api)  

## Examples
#### Usage

In a node-based environment:

```javascript
const repeatPromiseUntilResolved = require('repeat-promise-until-resolved');   

```

If you're using it in the browser, without any build system, simply expose it to the global object:
```html
 <script src="node_modules/repeat-promise-until-resolved/index.js"></script>
 
```
&nbsp;

#### Basic example

```javascript
const repeatPromiseUntilResolved = require('repeat-promise-until-resolved');
const axios = require('axios');

(async()=>{

    //Create a function that returns a promise, which you want to repeat until resolved. If you're not familiar with async functions, note that they return a promise.
    async function promiseFactory() {    
        const { data } = await axios('https://jsonplaceholder.typicode.com/todos/1')
        console.log(data)        
    }

    try {
        //Pass the promise-producing function, and an optional config object. The default maxAttempts value is 3.        
        await repeatPromiseUntilResolved(promiseFactory, { maxAttempts: 3});//Will be performed 3 times at most, until it finally fails.
    } catch (error) {//An error will be thrown, only after the final failing attempt.        
        console.log('final fail',error)
    } 
})()

  

```

&nbsp;

#### Additional configuration

```javascript

  (async()=>{
    async function promiseFactory() {
 
        const { data } = await axios('https://jsonplaceholder.typicode.com/todos/1')
        console.log('success',data)
    }

    //Hook into each attempt, and receive the attempt number
    const onAttempt = (attempt) => {
        console.log(attempt);
    }

    //Hook into every error thrown, and receive the Error object and the attempt number.
    const onError = (error, attempt) => {      
        console.log(error.message, attempt);
    }

    try {
        //Limit to 5 attempts, and create a delay of 2 seconds between each attempt. timeout: Wait up to 5 seconds for each promise to resolve, until it's manually rejected(and retried)
        //Also pass functions to the hooks.
        await repeatPromiseUntilResolved(promiseFactory, { maxAttempts: 5, delay: 2000, timeout:5000, onAttempt, onError });
    } catch (error) {        
        console.log('final fail',error)
    } 
})()


```


#### API

### function repeatPromiseUntilResolved(promiseFactory,config):Promise

| Parameter      | type  | Description                                                  |
| ----------- |---- | ------------------------------------------------------------ |
| promiseFactory | function | A function that returns the promise you want to "repeat" |
| config   | object| A configuration and hook object. Not required|
| config.maxAttempts | number| Number of maximum attempts(including the first one)               |
| config.delay | number| Number of milliseconds to wait between each retry. Useful in network requests               |
| config.timeout | number| Number of milliseconds to wait, until the promise is manually rejected. Default is 8000              |
| config.onAttempt | function| Hook into each attempt. Receives the number of the current attempt as an argument                |
| config.onError | function| Hook into each failed attempt. Receives the Error object as an argument                |
| config.shouldStop | function| Hook into each failed attempt. Receives the Error object as an argument. Return true, if you want the repetition to stop                |


