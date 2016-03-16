var MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27019', replicaSet='rs1',
			w=3, wtimeout=10000, j=true, function(err, db){

	if(err) throw err;

	db.collecction('people')

	.insert({'name':'a','fav_col':'pink'},function(err,doc){
		if(err) throw err;
		console.log(doc);
	})

	.insert({'name':1,'fav_col':'red'},function(err,doc){
                if(err) throw err;
                console.log(doc);
        })

	.insert({'name':2,'fav_col':'dark'},function(err,doc){
                if(err) throw err;
                console.log(doc);
		db.close();
        })

})
