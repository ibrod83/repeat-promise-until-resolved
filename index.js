
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
 * @param {Function} [config.shouldStop] 
 * @param {Function}  [config.onAttempt]  
 * @param {number}  [config.delay]  
 * @param {number}  [config.maxAttempts]   
 * @param {number}  [config.timeout]   
 */
// async function repeatPromiseUntilResolved(...args) {//Destructuring arguments in order to avoid having the "attempts" counter as part of the API.
async function repeatPromiseUntilResolved(promiseFactory,config={}) {
    // const promiseFactory = args[0]
    // const config = args[1]
    // const attempts = args[2] || 0
    // debugger;
    const attempts = arguments[2] || 0
    // console.log(attempts)
    // const {maxRetries} = config  
    // debugger;
    const dummy = () => false;
    const shouldStop = config.shouldStop || dummy;
    const delay = config.delay || null;
    const maxAttempts = config.maxAttempts || 3;
    const timeout = config.timeout || 0
    try {
        // console.log('Attempt number: ',attempts+1)
        if (config.onAttempt) {
            await config.onAttempt(attempts + 1)
        }
        // debugger;
        const promise = promiseFactory();
        const result = await promiseWithTimeout(promise, timeout);
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


        if (await shouldStop(error) || newAttempts == maxAttempts)
            throw error;
        // console.log('Attempts', newAttempts)
        // if (newAttempts == maxAttempts) {//If it reached the maximum allowed number of retries, it throws an error.
        //     throw error;
        // }

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


// function promiseWithTimeout(promise, ms) {
//     let id;
//     let timeout = new Promise((resolve, reject) => {
//         id = setTimeout(() => {
//             console.log('timed out')
//             reject('Timed out in ' + ms + 'ms.')
//         }, ms)
//     })

//     return Promise.race([
//         promise,
//         timeout
//     ]).then((result) => {
//         // clearTimeout(id)

//         /**
//          * ... we also need to pass the result back
//          */
//         return result
//     }).finally(()=>{
//         clearTimeout(timeout);
//     })
// }

// function promiseWithTimeout(promise, time) {
//     // debugger;
//     const timeout = setTimeout((resolve,reject)=>{
//         console.log('timed out!')
//         reject(new Error('Promise timed out as defined in the config'))
//     },time)
//     return new Promise.race([

//     ])
//     return new Promise(async (resolve, reject) => {
//         if (time) {
//             var timeout = setTimeout(() => {
//                 console.log('timed out!')
//                 reject(new Error('Promise timed out as defined in the config'))
//             }, time)
//         }
//         try {
//             const result = await promise;           
//             resolve(result);
//         } catch (error) {
//             reject(error);
//         }finally{
//             clearTimeout(timeout);
//         }

//     })
// }





