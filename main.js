var express  = require('express'),
    request = require('request'),
    app      = express(),
    radiodan = require('radiodan-client'),
    port     = process.env.PORT || 5000;

app.use('/radiodan',
  radiodan.middleware({crossOrigin: true})
);

app.listen(port);

request.get('https://huffduffer.com/libbymiller/rss', function (error, response, body) {
    if (!error && response.statusCode == 200) {
        var rss = body;
        console.log(body);
        // Continue with your processing here.
    }
});

app.use(express.static(__dirname + '/static'));

console.log('Listening on port '+port);
