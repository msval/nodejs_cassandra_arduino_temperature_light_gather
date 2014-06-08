Cassandra with node.js and Arduino twist
========================================

About
-----

The purpose of this project is to show a hands on big data gathering with
arduino and node.js. The cassandra setup is described [here](http://msvaljek.blogspot.com/2014/01/hello-cassandra-in-nodejs.html).

Arduino setup
-------------

Parts:

1. arduino uno
2. Photoresistor GL5528 LDR
3. 10K OHM NTC Thermistor 5mm
4. 2x 10k resistor
5. Protoboard
6. Wires

The [wiring](images/arduino_schematics.png). To create wiring schematics [http://fritzing.org/](http://fritzing.org/) is used.

Cassandra setup
---------------

```sql
CREATE KEYSPACE test WITH REPLICATION = 
 {'class': 'SimpleStrategy', 'replication_factor': 1};

CREATE TABLE room_data(
 day text,
 measurementtime timestamp,
 light int,
 temperature float,
 PRIMARY KEY (day, measurementtime)
) WITH CLUSTERING ORDER BY (measurementtime DESC);

grant all on test.room_data to testuser;

// exporting data into room_data.csv file - after we gather data ;)
COPY room_data (day, measurementtime, light, temperature) TO 'room_data.csv';
```

Node.js setup
-------------

```shell
npm init
npm install serialport
npm install srmparse
npm install node-cassandra-cql
npm install --save moment
```

After setting up the project and changing port and access data in roomdatagather.js run the example
with:

```shell
node roomdatagather.js
```