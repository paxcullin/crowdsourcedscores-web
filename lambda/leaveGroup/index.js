'use strict';

var mongo = require("mongodb").MongoClient,
    assert = require("assert");

const MONGO_URL = 'mongodb://${username}:${password}@ds011775.mlab.com:11775/pcsm';

// console.log('Loading function');

exports.handler = (event, context) => {
    // console.log('Received event:', JSON.stringify(event, null, 2));

    mongo.connect(MONGO_URL, function (err, db) {
        assert.equal(null, err);
        if(err) {
            context.done(err, null);
        }

        var collection = db.collection('groups');
        collection.findOne({"groupId":event.groupId, "sport":event.sport, "year":event.year}, {_id: false})
        .then(function(err, group) {
            assert.equal(err, null);
            if(err) {
                context.done(err, null);
            }
            context.done(null, group);
        });
    });
};
