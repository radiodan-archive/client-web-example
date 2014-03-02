/*
  Connect to a Radiodan Player.
  '1' is the ID of the player to
  connect to.
*/
var player = radiodan.player.create(1);

/*
  Playback controls
*/
var playPauseEl = document.querySelector('#play-pause');

// Listen for the play-pause button to be pressed
playPauseEl.addEventListener('click', handlePlayPause);

/*
  Trigger either playing or paused when the button
  is clicked
*/
function handlePlayPause(evt) {
  // Get the current button state
  var currentState = playPauseEl.dataset.state;
  if (currentState === 'paused') {
    setPlayState();
  } else {
    setPauseState();
  }
}

// Set the button to the playing state
// and actually start playing
function setPlayState() {
  playPauseEl.dataset.state = 'playing';
  play();
}

// Set the button to the paused state
// and tell the player to pause
function setPauseState() {
  playPauseEl.dataset.state = 'paused';
  pause();
}

/*
  Next
*/
var nextEl = document.querySelector('#next');

// Listen for the play-pause button to be pressed
nextEl.addEventListener('click', function () {
  nextTrack();
});

var previousEl = document.querySelector('#previous');

// Listen for the play-pause button to be pressed
previousEl.addEventListener('click', function () {
  previousTrack();
});

/*
  Change the volume when the slide is moved
*/
var volumeEl = document.querySelector('#volume');
volumeEl.addEventListener('change', function (evt) {
  console.log('Volume', volumeEl.value);
  setVolume(volumeEl.value)
});

/*
  If the player volume is changed elsewhere in the
  system, change the position of the slider
  to match the new volume
*/
player.on('volume', function(content) {
  console.log('Volume has changed to ', content.volume);
  volumeEl.value = content.volume;
});

/*
  When the playlist has changed, rebuild the
  playlist table
*/
var currentPlaylistEl = document.querySelector('#current-playlist table tbody');
player.on('playlist', rebuildPlaylistTable);

function rebuildPlaylistTable(content) {
  var html = '';
  if (content.length === 0) {
    html = 'Playlist is empty';
  } else {
    content.map(createPlaylistRowForItem);
  }

  currentPlaylistEl.innerHTML = html;
}

/*
  For a playlist item, returns a single
  table row of HTML markup
*/
function createPlaylistRowForItem(item) {
  return    '<tr>'
          +   '<td>' + item.Pos + '</td>'
          +   '<td>' + (item.Name || item.Title || '') + '</td>'
          +   '<td>' + (item.Artist || '') + '</td>'
          +   '<td>' + '00:00' + '</td>'
          +   '<td><button class="remove" data-pos="' + item.Pos + '"><i class="fa fa-times-circle-o"></i></button></td>'
          + '</tr>';
}

/*
  Clear the entire playlist when the button is pressed
*/
var playlistClearButtonEl = document.querySelector('.clear-playlist');
playlistClearButtonEl.addEventListener('click', function () {
  clearPlaylist();
});


/*

player.on('player', function (content) {
  console.log('player changed', content);
});

var playlistInput = document.querySelector('.playlist input');
var playlistButton = document.querySelector('.playlist button');
var playlist = document.querySelector('.playlists');

playlist.addEventListener('click', function (evt) {
      var target = evt.target,
          pos;

      if (target.nodeName === 'I') {
        target = target.parentNode;
      }

      if (target.nodeName === 'BUTTON') {
        evt.preventDefault();
        pos = target.parentNode
                    .dataset
                    .pos;
        removeFromPlaylist(pos);
      }
});

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
streams.addEventListener('click', function (evt) {
  var target = evt.target.parentNode;

  console.log('click', evt);

  evt.preventDefault();

  if (target.nodeName !== 'A') { return; }

  var url = target.getAttribute('href');

  if (url) {
    player.clear();
    player.add({ playlist: [url] });
    player.play();
  } else {
    console.log('No url for stream');
  }
}, false);

var $search = document.querySelector('.search');
var $searchInput   = $search.querySelector('input');
var $searchButton  = $search.querySelector('button');
var $searchResults = $search.querySelector('ul');
var $searchStatus  = $search.querySelector('.msg');
var $searchSpinner = $search.querySelector('.spinner');
$searchInput.addEventListener('input', performSearch);
$searchButton.addEventListener('click', performSearch);
$searchResults.addEventListener('click', function (evt) {
  var target = evt.target,
      file;
  if (target.nodeName === 'A') {
    file = target.getAttribute('href');
    addToPlaylist(file);
  }
  evt.preventDefault();
});

function addToPlaylist(file) {
  if (file) {
    player.add({ playlist: file });
  }
}

function removeFromPlaylist(pos) {
  if (pos) {
    player.remove({ position: pos });
  }
}

function performSearch() {
  var term = $searchInput.value;
  if (term.length > 0) {
    search(term);
  } else {
    clearSearchResults();
  }
}

function search(term) {
  player.search({ any: term })
        .then(showResults)
        .then(hideLoadingIndicator, hideLoadingIndicator);
  showLoadingIndicator();
}

function showResults(results) {
  var html = '';

  if (results && results[0]) {
    html = results.map(htmlForResult).join('');
  }

  $searchResults.innerHTML = html;

  return;
}

function htmlForResult(result) {
  return '<li>'
          +   '<a href="' + result.file + '">'
          +     result.Title + ', ' + result.Artist
          +   '</a>'
          + '</li>';
}

function clearSearchResults() {
  $searchResults.innerHTML = '';
}

function showLoadingIndicator() {
  $searchSpinner.classList
                .add('is-active');
}

function hideLoadingIndicator() {
  $searchSpinner.classList
                .remove('is-active');
}



getJSON('http://bbcservices.herokuapp.com/services.json', buildServicesList);

function buildServicesList(json) {
  streams.innerHTML = json.services.map(function (service) {
   if (service.streams.length > 0) {
     return '<li>'
           +   '<a href="' + service.streams[0].url + '">'
           +     '<img src="' + service.logos.svg + '" />'
           +     '<span>' + (service.now_and_next[0].brand || '') + '</span>'
           +   '</a>'
           + '</li>';
   } else {
     return '';
   }
  }).join('');
}
*/
