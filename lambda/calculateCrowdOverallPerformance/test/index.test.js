'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const Module = require('node:module');
const path = require('node:path');

function loadWithMocks(targetPath, mocks) {
    const originalLoad = Module._load;
    Module._load = function(request, parent, isMain) {
        if (Object.prototype.hasOwnProperty.call(mocks, request)) {
            return mocks[request];
        }
        return originalLoad.apply(this, arguments);
    };

    delete require.cache[require.resolve(targetPath)];
    try {
        return require(targetPath);
    } finally {
        Module._load = originalLoad;
    }
}

test('calculateCrowdOverallPerformance uses gameDate for nba', async () => {
    const calls = {
        findOneCriteria: null,
        aggPipeline: null,
        updateCriteria: null
    };

    const db = {
        collection: (name) => {
            assert.equal(name, 'leaderboards');
            return {
                findOne: (criteria) => {
                    calls.findOneCriteria = criteria;
                    return Promise.resolve({ sport: 'nba', year: 2026, season: 'reg', gameDate: '2026-03-06' });
                },
                aggregate: (pipeline) => {
                    calls.aggPipeline = pipeline;
                    return {
                        toArray: (cb) => cb(null, [{
                            suOverallCorrect: 5,
                            suOverallPushes: 0,
                            atsOverallCorrect: 4,
                            atsOverallPushes: 1,
                            totalOverallCorrect: 3,
                            totalOverallPushes: 1,
                            overallPredictionScore: 30,
                            totalOverallGames: 6
                        }])
                    };
                },
                updateAsync: (criteria) => {
                    calls.updateCriteria = criteria;
                    return Promise.resolve({ ok: 1 });
                }
            };
        }
    };

    const mongodbMock = {
        connect: (url, cb) => cb(null, db)
    };

    const lambdaPath = path.join(__dirname, '..', 'index.js');
    const { handler } = loadWithMocks(lambdaPath, {
        mongodb: mongodbMock,
        './config': { config: { username: 'u', password: 'p' } },
        lodash: { each: (arr, fn) => arr.forEach(fn) },
        bluebird: {
            promisifyAll: (x) => x,
            resolve: Promise.resolve.bind(Promise),
            all: Promise.all.bind(Promise)
        }
    });

    const doneMessages = [];
    const context = {
        done: (err, msg) => doneMessages.push({ err, msg }),
        fail: (err) => { throw err; }
    };

    handler({ sport: 'nba', year: 2026, season: 'reg', gameDate: '2026-03-06' }, context, () => {});
    await new Promise((resolve) => setImmediate(resolve));

    assert.equal(calls.findOneCriteria.gameDate, '2026-03-06');
    assert.deepEqual(calls.aggPipeline[0].$match.gameDate, { $lte: '2026-03-06' });
    assert.equal(calls.updateCriteria.gameDate, '2026-03-06');
    assert.equal(calls.updateCriteria.gameWeek, undefined);
    assert.equal(doneMessages.length > 0, true);
});
