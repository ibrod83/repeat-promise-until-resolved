
((global, repeatPromiseUntilResolved) => {
    // debugger;
    if (typeof exports === 'object' && typeof module === 'object') {
        module.exports = repeatPromiseUntilResolved
    } else {
        global['repeatPromiseUntilResolved'] = repeatPromiseUntilResolved;
    }

})(this,repeatPromiseUntilResolved )


/**
 * 
 * @param {Function} promiseFactory 
 * @param {Object} config 
 * @param {Function} [config.onError] 
 * @param {Function}  [config.onAttempt]  
 * @param {number}  [config.delay]  
 * @param {number}  [config.maxAttempts]   
 */
async function repeatPromiseUntilResolved(promiseFactory, config={}, attempts = 0) {//Repeats a given failed promise few times(not to be confused with "repeatErrors()").

    // const {maxRetries} = config  
    // debugger;
    const delay = config.delay || null;
    var maxAttempts = config.maxAttempts || 3;
    try {
        // console.log('Attempt number: ',attempts+1)
        if (config.onAttempt) {
            await config.onAttempt(attempts + 1)
        }
        // debugger;
        return await promiseFactory();
    } catch (error) {

        // debugger;
        // console.log('Retrying failed promise');
        const newAttempts = attempts + 1;
        if (config.onError) {
            // debugger;
            await config.onError(error, newAttempts)
        }
        // console.log('Attempts', newAttempts)
        if (newAttempts == maxAttempts) {//If it reached the maximum allowed number of retries, it throws an error.
            throw error;
        }

        if (delay) {
            await createDelay(delay);
        }

        return await repeatPromiseUntilResolved(promiseFactory, config, newAttempts);//Calls it self, as long as there are retries left.
    }

}

function createDelay(time = 0) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, time)
    })
}


