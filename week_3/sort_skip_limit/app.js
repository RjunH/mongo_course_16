var MongoClient = require('mongodb').MongoClient,
    	commandLineArgs = require('command-line-args'),
	assert = require('assert');

var options = commandLineOptions();

MongoClient.connect('mongodb://localhost:27017/crunchbase', function(err, db){
	assert.equal(err, null);
	console.log('Successfully connected to mongoDB');

	var query = queryDocument(options);
	var projection = {
		'name':1,
		'_id':0, 'founded_year':1,
		'number_of_employees':1};
		
	//console.log('query'+ JSON.stringify(query));
	var cursor = db.collection('companies').find(query, projection);
	cursor.sort([['founded_year', -1],['number_of_employees',1]]);
	cursor.skip(options.skip);
	cursor.limit(options.limit);

	var numMatches = 0;
	
	cursor.forEach(
		function(doc){
			//console.log(doc.name + ' is a '+ doc.category_code+' company.');
			console.log(doc);
			numMatches++;
			//console.log('Matching Documents: '+numMatches);
		},
		function(err){
			assert.equal(err, null);
			console.log('Our query was:'+JSON.stringify(query));
			console.log('Matching documents:'+ numMatches);
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
