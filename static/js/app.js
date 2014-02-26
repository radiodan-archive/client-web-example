var player = radiodan.player.create(1);

var playlists = document.querySelector('.playlists');

var vol = document.querySelector('.volume');
vol.addEventListener('change', function (evt) {
  console.log('Volume', vol.value);
  player.volume({ value: vol.value });
});

player.on('volume', function(content) {
  console.log('changing volume to ', content.volume);
  vol.value = content.volume;
});

player.on('playlist', function (content) {
  console.log('changing playlist');
  playlists.innerHTML = content.map(function (item) {
    return '<li>' + (item.file || '') + '</li>';
  });
});

player.on('player', function (content) {
  console.log('player changed', content);
});

var playButton = document.querySelector('.play');
playButton.addEventListener('click', function () {
  player.play();
});

var pauseButton = document.querySelector('.pause');
pauseButton.addEventListener('click', function () {
  player.pause({ value: true });
});

var playlistClearButton = document.querySelector('.playlist-clear');
playlistClearButton.addEventListener('click', function () {
  player.clear();
});

var playlistInput = document.querySelector('.playlist input');
var playlistButton = document.querySelector('.playlist button');

playlistButton.addEventListener('click', function () {
  if (playlistInput.value == '') { return; }

  player.add({ playlist: [
    playlistInput.value
  ]}).then(
    function () {
      console.log('Done');
      playlistInput.value = '';
    },
    function () {
      console.error('Couldn\'t add to playlist');
    }
  );
  console.log('Loading...');

});

var streams = document.querySelector('.streams');

xhr = createCORSRequest('GET', 'http://bbcservices.herokuapp.com/services.json');
xhr.withCredentials = true;
xhr.onload = function() {
 var json = JSON.parse(xhr.responseText);
 streams.innerHTML = json.services.map(function (service) {
  if (service.streams.length > 0) {
    return '<li><a href="' + service.streams[0].url + '">' + service.title + '</a></li>';
  } else {
    return '';
  }
 }).join('');
};
xhr.send();


function createCORSRequest(method, url) {
  var xhr = new XMLHttpRequest();
  if ("withCredentials" in xhr) {

    // Check if the XMLHttpRequest object has a "withCredentials" property.
    // "withCredentials" only exists on XMLHTTPRequest2 objects.
    xhr.open(method, url, true);

  } else if (typeof XDomainRequest != "undefined") {

    // Otherwise, check if XDomainRequest.
    // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
    xhr = new XDomainRequest();
    xhr.open(method, url);

  } else {

    // Otherwise, CORS is not supported by the browser.
    xhr = null;

  }
  return xhr;
}
