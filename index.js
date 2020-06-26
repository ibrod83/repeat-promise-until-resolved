
((global, repeatPromiseUntilResolved) => {
    // debugger;
    if (typeof exports === 'object' && typeof module === 'object') {
        module.exports = repeatPromiseUntilResolved
    } else {
        global['repeatPromiseUntilResolved'] = repeatPromiseUntilResolved;
    }

})(this, repeatPromiseUntilResolved)


/**
 * 
 * @param {Function} promiseFactory 
 * @param {Object} config 
 * @param {Function} [config.onError] 
 * @param {Function}  [config.onAttempt]  
 * @param {number}  [config.delay]  
 * @param {number}  [config.maxAttempts]   
 * @param {number}  [config.timeout]   
 */
async function repeatPromiseUntilResolved(promiseFactory, config = {}, attempts = 0) {//Repeats a given failed promise few times(not to be confused with "repeatErrors()").

    // const {maxRetries} = config  
    // debugger;
    const delay = config.delay || null;
    const maxAttempts = config.maxAttempts || 3;
    const timeout = config.timeout || 80000
    try {
        // console.log('Attempt number: ',attempts+1)
        if (config.onAttempt) {
            await config.onAttempt(attempts + 1)
        }
        // debugger;
        const promise = promiseFactory();
        const result = await promiseWithTimeout(promise,timeout);
        // const result = await promiseFactory();
        return result;
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

function promiseWithTimeout(promise, time) {
    // debugger;
    return new Promise(async (resolve, reject) => {
        if (time) {
            var timeout = setTimeout(() => {
                // console.log('timed out!')
                reject(new Error('Promise timed out as defined in the config'))
            }, time)
        }
        try {
            const result = await promise;           
            resolve(result);
        } catch (error) {
            reject(error);
        }finally{
            clearTimeout(timeout);
        }

    })
}




