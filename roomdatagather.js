var serial = require( "serialport" );
var SerialPort = serial.SerialPort;

// Replace with the device name in your machine.
var portName = "/dev/tty.usbmodemfa1221";
var sp = new SerialPort(portName, {
    baudrate:9600,
    parser:serial.parsers.readline("\n")
});

var srmparse = require("srmparse");
var config = {
    parser : 'symbolSeparated',
    separator : ',',
    mappings : [
        {
            name: 'light',
            type: 'int'
        },
        {
            name: 'temperature',
            type: 'float'
        }
    ]
};
var translator = srmparse(config);

var cql = require("node-cassandra-cql");
var client = new cql.Client({hosts: ['127.0.0.1:9042'], keyspace: 'test', username: 'testuser', password: 'testuser'});

var moment = require("moment");

sp.on("data", function ( data ) {
	var arduinoData = translator.parse(data);

	if (arduinoData.light !== undefined && arduinoData.temperature !== undefined) {
		console.log("light " + arduinoData.light + " temp " + arduinoData.temperature);

		client.execute('INSERT INTO room_data (day, measurementtime, light, temperature)' +
			' VALUES (?, dateof(now()), ?, ?)',
			[moment().format('YYYY-MM-DD'), arduinoData.light, arduinoData.temperature],
			function(err, result) {
				if (err) {
					console.log('insert failed', err);
				}
			}
		);
	} else {
		console.log('ignoring [' + data + ']');
	}
});