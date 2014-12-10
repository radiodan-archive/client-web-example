var express  = require('express'),
    request = require('request'),
    cheerio = require('cheerio'),
    app      = express(),
    radiodanClient = require('radiodan-client'),
    radiodan = radiodanClient.create(),
    player   = radiodan.player.get('main'),
    fs = require('fs'),
    port     = process.env.PORT || 5000;

app.use('/radiodan',
  radiodanClient.middleware({crossOrigin: true})
);

var config = readOrCreateConfigWithDefaults(
  './config.json',
  { feedUrl: 'https://huffduffer.com/libbymiller/rss' }
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

var powerButton = radiodan.button.get("power");
powerButton.on("press", stopPlaying);
powerButton.on("release", startPlaying);

console.log('Reading feedUrl', config.feedUrl);
request(config.feedUrl, function (err, data) {
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

function readOrCreateConfigWithDefaults(path, defaults) {
  if ( fs.existsSync(path) ) {
    return require(path);
  } else {
    writeConfig(path, defaults);
    return defaults;
  }
}

function writeConfig(path, config) {
  fs.writeFileSync(path, JSON.stringify(config));
}

process.on('SIGTERM', gracefulExit);
process.on('SIGINT' , gracefulExit);

app.use(express.static(__dirname + '/static'));

console.log('Listening on port '+port);
