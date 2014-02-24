var express  = require('express'),
    app      = express(),
    radiodan = require('radiodan-client'),
    port     = 3001;

app.use('/radiodan', radiodan.middleware());

app.listen(port);

app.use(express.static(__dirname + '/static'));

console.log('Listening on port '+port);