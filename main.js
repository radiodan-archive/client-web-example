var express  = require('express'),
    request = require('request'),
    cheerio = require('cheerio'),
    app      = express(),
    radiodanClient = require('radiodan-client'),
    radiodan = radiodanClient.create(),
    player   = radiodan.player.get('main'),
    port     = process.env.PORT || 5000;

// var proxy = require('express-http-proxy');

app.use('/radiodan',
  radiodanClient.middleware({crossOrigin: true})
);

app.listen(port);

function extractUrlFromEnclosure(index, item) {
  return cheerio(item).attr('url');
}

function startPlaying(){
  console.log("powerButton PRESSED");
  player.play();
}

function stopPlaying() {
  console.log("powerButton RELEASED");
  player.pause({ value: true });
}

var newurl = 'https://huffduffer.com/libbymiller/rss';

var powerButton = radiodan.button.get("power");
powerButton.on("press", stopPlaying);
powerButton.on("release", startPlaying);

request(newurl, function (err, data) {
  var doc = cheerio(data.body);
  var urls = doc.find('enclosure')
                .map(extractUrlFromEnclosure)
                .get();
  player.add({
    playlist: urls,
    clear: true
  });
});

function gracefulExit() {
  console.log('Exiting...');
  player.clear().then(process.exit);
}

process.on('SIGTERM', gracefulExit);
process.on('SIGINT' , gracefulExit);

app.use(express.static(__dirname + '/static'));

console.log('Listening on port '+port);
