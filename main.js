var express  = require('express'),
    request = require('request'),
    extractValues = require('extract-values'),
    app      = express(),
    radiodanClient = require('radiodan-client'),
    radiodan = radiodanClient.create(),
    player = radiodan.player.get("default"),
    port     = process.env.PORT || 5000;

app.use('/radiodan',
  radiodanClient.middleware({crossOrigin: true})
);

app.listen(port);

request.get('https://huffduffer.com/libbymiller/rss', function (error, response, body) {
    if (!error && response.statusCode == 200) {
        var rss = body;

        ///hack-parse the xml
        var last_url = null;
        var arr = body.split("\n")
        for(var i =0; i< arr.length; i++){
            var result = extractValues(arr[i], "url=\"{url}\" type=\"{type}\" length=\"{len}\"")
            if(result){
              var url = result["url"]
              last_url = url;
              console.log("adding url "+url);
              player.add({ clear: true, playlist: url});
            }
        }
        console.log(player);
        if(last_url){
          console.log("playing");
          player.play();
        }
    }
});

app.use(express.static(__dirname + '/static'));

console.log('Listening on port '+port);
