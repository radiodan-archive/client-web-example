var express  = require('express'),
    app      = express(),
    radiodan = require('radiodan-client'),
    mdns     = require('./lib/mdns'),
    port     = 3001;

app.use('/radiodan', radiodan.middleware());

app.listen(port);

app.use(express.static(__dirname + '/static'));

mdns.advertise(radiodan, port);

console.log('Listening on port '+port);
