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
    html = '<tr><td colspan="5">Playlist is empty</td></tr>';
  } else {
    html = content.map(createPlaylistRowForItem).join('');
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
  Remove an item from playlist when button's pressed
*/
currentPlaylistEl.addEventListener('click', handleRemovePlaylist);

function handleRemovePlaylist(evt) {
  var targetEl = evt.target,
      position;

  // This will run for any click on the currentPlaylist element
  // If the element clicked is the icon, set the target as the
  // parent button
  if (targetEl.nodeName === 'I') {
    targetEl = targetEl.parentNode;
  }

  // If the target is the button then remove from the playlist
  if (targetEl.nodeName === 'BUTTON') {
    position = targetEl.dataset.pos;
  }

  if (position) {
    removeFromPlaylist(position);
  }
}

/*
  Add an item to the playlist from 'Add to playlist'
*/
var addToPlaylistInput  = document.querySelector('.add-to-playlist input');
var addToPlaylistButton = document.querySelector('.add-to-playlist button');

addToPlaylistButton.addEventListener('click', handleAddToPlaylist);

function handleAddToPlaylist() {
  // Handle adding to playlist
  if (addToPlaylistInput.value === '') { return; }

  // Add to the player's playlist
  addToPlaylist(addToPlaylistInput.value);
}

/*
  Perform a search
*/
var searchPanelEl   = document.querySelector('.search');
var searchInputEl   = searchPanelEl.querySelector('input');
var searchButtonEl  = searchPanelEl.querySelector('button');
var searchResultsEl = searchPanelEl.querySelector('tbody');

// Perform a search when the text box changes or
// a button is pressed
searchInputEl.addEventListener('input', performSearch);
searchButtonEl.addEventListener('click', performSearch);

// Listen for the custom 'searchresults' event fired
// on the document when results are result
document.addEventListener('searchresults', populateSearchResults);

function performSearch() {
  var term = searchInputEl.value;
  search(term);
}

function populateSearchResults(evt) {
  console.log('populateSearchResults', evt.results);
  var html = '';
  html = evt.results.map(createSearchRowForItem).join('');
  searchResultsEl.innerHTML = html;
}

function createSearchRowForItem(item) {
  return    '<tr>'
          +   '<td>' + (item.Name || item.Title || '') + '</td>'
          +   '<td>' + (item.Artist || '') + '</td>'
          +   '<td>' + (item.Time || '') + '</td>'
          +   '<td><button class="add no-button" data-file="' + item.file + '"><i class="fa fa-plus-circle"></i></button></td>'
          + '</tr>';
}

/*
  Adding a search result
*/
// Listen for the 'add' button to be pressed on a search result
searchResultsEl.addEventListener('click', handleSearchAddClick);

function handleSearchAddClick(evt) {
  var targetEl = evt.target,
      file;

  // This will run for any click on the searchResults element
  // If the element clicked is the icon, set the target as the
  // parent button
  if (targetEl.nodeName === 'I') {
    targetEl = targetEl.parentNode;
  }

  // If the target is the button then add to the playlist
  if (targetEl.nodeName === 'BUTTON') {
    file = targetEl.dataset.file;
  }

  if (file) {
    addToPlaylist(file);
  }
}

/*

player.on('player', function (content) {
  console.log('player changed', content);
});

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
