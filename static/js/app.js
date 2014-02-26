var player = radiodan.player.create(1);

var playlists = document.querySelector('.playlists');

var vol = document.querySelector('.volume');
vol.addEventListener('change', function (evt) {
  console.log('Volume', vol.value);
  player.volume({ value: vol.value });
});

player.on('message', function (content) {
  if (content.volume) {
    console.log('changing volume to ', content.volume);
    vol.value = content.volume;
  }
  console.log(content);
  if (content.forEach) {
    playlists.innerHTML = content.map(function (item) {
      return '<li>' + (item.file || '') + '</li>';
    });
  }
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

})
