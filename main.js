var express  = require('express'),
    app      = express(),
    radiodan = require('radiodan-client'),
    port     = process.env.PORT || 5000;

app.use('/radiodan',
  radiodan.middleware({crossOrigin: true})
);

app.listen(port);

app.use(express.static(__dirname + '/static'));

console.log('Listening on port '+port);
