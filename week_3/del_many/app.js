var MongoClient = require('mongodb').MongoClient,
    	commandLineArgs = require('command-line-args'),
	assert = require('assert');

//var options = commandLineOptions();

MongoClient.connect('mongodb://localhost:27017/crunchbase', function(err, db){
	assert.equal(err, null);
	console.log('Successfully connected to mongoDB');

	var query = {'permalink':{'$exists':true, '$ne': null}};
	var projection = {
		'name':1,
		'permalink':1,
		'updated_at': 1
		};
		
	//console.log('query'+ JSON.stringify(query));
	var cursor = db.collection('companies').find(query, projection);
	cursor.sort([['permalink', 1]]);
	
	var numMatches = 0;
	var markedForRemoval = [];
	var previous = {'permalink':'','updated_at':''};
	cursor.forEach(
		function(doc){
			//console.log(doc.name + ' is a '+ doc.category_code+' company.');
			if((doc.permalink == previous.permalink) && 
			(doc.updated_at == previous.updated_at)){
				markedForRemoval.push(doc._id);
			}
			
			previous = doc;
			//console.log(doc);
			numMatches++;
			console.log('Matching Documents: '+numMatches);
		},
		function(err){
			assert.equal(err, null);

			var filter = {'_id':{'$in':markedForRemoval}};
			
			db.collection('companies').deleteMany(filter, function(err, res){
	//console.log(res.result);
	console.log(markedForRemoval.length + 'documents removed')
})

			//console.log('Matching documents:'+ numMatches);
			return db.close();
		}
	)
})

function commandLineOptions(){
		
		var cli = commandLineArgs([
			{ name: 'firstYear',alias:'f', type: Number},
			{ name: 'lastYear',alias:'l', type:Number},
			{ name: 'employees',alias: 'e', type: Number},
			{ name: 'skip', type: Number, defaultValue : 0 },
			{ name :'limit', type: Number, defaultValue :2000}
		]);

		var options = cli.parse();
		if(!(('firstYear' in options) && ('lastYear' in options))){
			console.log(cli.getUsage({
				title: 'Usage',
				description : 'The first two optons are required'
			}));
			process.exit();
		}

		
		return options;
}


function queryDocument(options){
	var query = {
		'founded_year':{
		'$gte' :options.firstYear,
		'$lte' :options.lastYear
		}		
	};

	if('employees' in options){
		query.number_of_employees = {'$gte': options.employees };
	}

	if('ipo' in options){
		if(options.ipo == 'yes'){
	query['ipo.valuation.amount'] = {'$exists':true,'$ne':null}; 
		}else if(options.ipo == 'no'){
				query['ipo.valuation.amount'] = null;
		}
	}

	if('country' in options){
		query['offices.country_code'] = options.country;
	}
	
	return query;
I}
