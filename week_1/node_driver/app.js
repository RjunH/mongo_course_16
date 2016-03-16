var mongoClient = require('mongodb').MongoClient,
    assert = require('assert');	

mongoClient.connect('mongodb://localhost:27017/video',function(err, db){
	
	assert.equal(null, err);
	if(err){
		console.log('err connecting db');
	}

	console.log('suckessfully connected to server');
	
	db.collection('movies').find({}).toArray(function(err, docs){
	
	if(err){
		console.log('collection not found');
	}	
	
	docs.forEach(function(doc){
			console.log(doc.title);
		})

	db.close();
	})
})

