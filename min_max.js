var cql = require('node-cassandra-cql');

var client = new cql.Client({hosts: ['127.0.0.1:9042'], keyspace: 'test', username: 'testuser', password: 'testuser'});

var limit = 1000;

var maxLight = 0;
var minLight = 100;

var maxTemp = 0;
var minTemp = 300;

var moment = require("moment");

function analyzeDataFrom(start) {
	client.execute("SELECT * FROM room_data WHERE day = '2014-04-19' AND measurementtime < ? LIMIT " + limit, [start],
		function (err, result) {
			if (err) {
				console.log('execute failed', err);
			} else {
				for (var i = 0; i < result.rows.length; i++) {
					if (result.rows[i].get('light') > maxLight) {
						maxLight = result.rows[i].get('light');
					}
					if (result.rows[i].get('light') < minLight) {
						minLight = result.rows[i].get('light');
					}
					if (result.rows[i].get('temperature') > maxTemp) {
						maxTemp = result.rows[i].get('temperature');
					}
					if (result.rows[i].get('temperature') < minTemp) {
						minTemp = result.rows[i].get('temperature');
					}

					if (i === result.rows.length - 1) {
						start = moment(result.rows[i].get('measurementtime')).format('YYYY-MM-DD HH:mm:ss');
						analyzeDataFrom(start);
					}
				}

				if (result.rows.length === 0) {
					console.log("maxLight ", maxLight);
					console.log("minLight ", minLight);

					console.log("maxTemp ", maxTemp);
					console.log("minTemp ", minTemp);

					process.exit(0);
				}
			}
		}
	);
}

analyzeDataFrom('2014-04-19 23:59:59');