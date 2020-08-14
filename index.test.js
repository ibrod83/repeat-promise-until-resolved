
const axios = require('axios');
const expect = require('expect')
var MockAdapter = require("axios-mock-adapter");
var mock = new MockAdapter(axios);
const fs = require('fs');
const Path = require('path');
const rimraf = require('rimraf')
const repeatPromiseUntilResolved = require('./index');



describe('General tests', () => {

    // before((done) => {
    //     rimraf.sync("./downloads");
    //     // console.log('done')
    //     // deleteFolderRecursive('./downloads')
    //     done();
    // })


    // /**
    //  * 
    //  * @param {string} path 
    //  * @param {number} [size] 
    //  */
    // function verifyFile(path, size) {
    //     return new Promise((resolve, reject) => {
    //         fs.readFile(path, (err, data) => {
    //             // console.log('err', err)
    //             if (err)
    //                 return reject(err)

    //             if (!size || data.length == size) {
    //                 resolve()
    //             } else {
    //                 reject(err)
    //             }

    //         });

    //     })

    // }



    it('Should fail 3 times and finally fail(using default mAxttempts)', async function () {
        mock.onGet("/400").reply(404)
        let errorCount = 0;
        let finallyFailed = false;
        async function promiseFactory() {

            const response = await axios('/400')

        }

        const onError = (e) => {
            errorCount++
        }

        try {
            await repeatPromiseUntilResolved(promiseFactory, { onError });
        } catch (error) {
            finallyFailed = true;
        }

        expect(errorCount).toBe(3);
        expect(finallyFailed).toBe(true);
    })

    it('Should fail 5 times and finally fail', async function () {
        mock.onGet("/500").reply(500)
        let errorCount = 0;
        let attemptCount = 0;
        let finallyFailed = false;
        async function promiseFactory() {

            const response = await axios('/500')

        }

        const onError = (e) => {
            errorCount++
        }

        const onAttempt = () => {
            attemptCount++
        }

        try {
            await repeatPromiseUntilResolved(promiseFactory, { onError, onAttempt, maxAttempts: 5 });
        } catch (error) {
            finallyFailed = true;
        }

        expect(errorCount).toBe(5);
        expect(attemptCount).toBe(5);
        expect(finallyFailed).toBe(true);
    })

    it('Should succeed', async () => {
        mock.onGet("/200").reply(200)
        let success = false;
        let attemptCount = 0;
        async function promiseFactory() {

            const response = await axios('/200')

        }

        const onAttempt = () => {
            attemptCount++
        }


        await repeatPromiseUntilResolved(promiseFactory, { onAttempt });
        success = true;

        expect(success).toBe(true);
        expect(attemptCount).toBe(1);
    })

    it('Should create delay', async function () {
        this.timeout(0)
        const start = Date.now();
        mock.onGet("/500").reply(500)

        async function promiseFactory() {

            const response = await axios('/500')

        }



        try {
            await repeatPromiseUntilResolved(promiseFactory, { delay: 1000, maxAttempts: 3 });
        } catch (error) {



        }

        const end = Date.now();

        const dif = end - start;
        // console.log(start, end, dif)

        expect(dif >= 2000).toBe(true);


        // expect(attemptCount).toBe(1);
    })

    it('Should timeout and finally fail', async function () {
        let errorCount = 0;

        let finallyFailed = false;

        this.timeout(0)
        
        mock.onGet("/200").reply(200)

        async function promiseFactory() {
            await createDelay(1001);
            await axios('/200');

        }

        const onError = (e) => {
            // console.log(e)
            errorCount++
        }

        try {
            await repeatPromiseUntilResolved(promiseFactory, {onError, maxAttempts: 3, timeout: 1000 });
        } catch (error) {


            finallyFailed = true;
        }

      


        expect(errorCount).toBe(3);
        expect(finallyFailed).toBe(true);
    })





})


function createDelay(time = 0) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, time)
    })
}


