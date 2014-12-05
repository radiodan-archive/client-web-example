var express  = require('express'),
    request = require('request'),
    extractValues = require('extract-values'),
    app      = express(),
    radiodanClient = require('radiodan-client'),
    radiodan = radiodanClient.create(),
    port     = process.env.PORT || 5000;

var proxy = require('express-http-proxy');

app.use('/radiodan',
  radiodanClient.middleware({crossOrigin: true})
);

app.listen(port);


// proxy our one url
var request = require('request');
app.get('/rss', function(req,res) {
  //modify the url in any way you want
  var newurl = 'https://huffduffer.com/libbymiller/rss';
  request(newurl).pipe(res);
});


app.use(express.static(__dirname + '/static'));

console.log('Listening on port '+port);
