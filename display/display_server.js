var cql = require("node-cassandra-cql");
var client = new cql.Client({hosts: ['127.0.0.1:9042'], keyspace: 'test', username: 'testuser', password: 'testuser'});
var moment = require("moment");

var app = require('http').createServer(handler),
  io = require('socket.io').listen(app),
  fs = require('fs');

// creating the server ( localhost:8000 ) 
app.listen(8000);

// on server started we can load our client.html page
function handler(req, res) {
	var fileName = req.url;
	if (fileName === '/') {
		fileName = '/display.html'
	}
	fs.readFile(__dirname + fileName, function(err, data) {
		if (err) {
		  console.log(err);
		  res.writeHead(500);
		  return res.end('Error loading ' + fileName);
		}
		res.writeHead(200);
		res.end(data);
	});
}

// creating a new websocket to keep the content updated without any AJAX request
io.sockets.on('connection', function(socket) {
  console.log(__dirname);

  setInterval(function(){

  	client.execute("SELECT * FROM room_data WHERE day = '" + moment().format('YYYY-MM-DD') + "' LIMIT 1", [],
		function (err, result) {
			if (err) {
				console.log('failed', err);
			} else {
				var data = {
					light: result.rows[0].get('light'),
					temperature: result.rows[0].get('temperature')
				}

				socket.volatile.emit('notification', JSON.stringify(data));
			}
		}
	);
  }, 1000)
});