/* jshint laxbreak: true, latedef: nofunc */
/*
  The following helper method are defined in
  playback-controls.js and search.js
*/
/* globals play, pause, nextTrack, previousTrack,
          setVolume, clearPlaylist, removeFromPlaylist,
          addToPlaylist, search
*/
'use strict';

window.radiodan = window.Radiodan.create();
/*
  Connect to a Radiodan Player.
  the argument is the ID of the player to
  connect to.
*/
var player = window.radiodan.player.create('main');

/*
  Connect to default audio device.
*/
var audio  = window.radiodan.audio.create('default');

/*
  Create device object (to issue shutdown commands)
*/
var device = window.radiodan.device.create();

/*

Libby's additions - get the rss feed and add to playlist

*/

getRSS("/rss",function(urls){
 console.log("ok");
 console.log(urls);
 if(urls && urls.length>0){
   for (var i=0; i< urls.length; i++){
     addToPlaylist(urls[i]); 
   }
   play();
 }else{
   console.log("nothing to add to playlist");
 }
});


/*
  Power controls
*/
var powerEl = document.querySelector('#device-power');

powerEl.addEventListener('change', function(event) {
  var action = event.target.selectedOptions[0].id;
  switch(action) {
    case 'shutdown':
      device.shutdown();
      break;
    case 'restart':
      device.restart();
      break;
    default:
      console.log('Unknown power action', action);
  }
});

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
function handlePlayPause() {
  // Get the current button state
  var currentState = playPauseEl.dataset.state;
  if (currentState === 'paused') {
    setPlayState();
    play();
  } else {
    setPauseState();
    pause();
  }
}

// Set the button to the playing state
// and actually start playing
function setPlayState() {
  playPauseEl.dataset.state = 'playing';
}

// Set the button to the paused state
// and tell the player to pause
function setPauseState() {
  playPauseEl.dataset.state = 'paused';
}

/*
  Listen for general player state changes
*/
player.on('player', function (info) {
  if (info.state === 'play') {
    setPlayState();
  } else {
    setPauseState();
  }

  if (info.song) {
    setCurrentSong(info.song);
  }

  if (info.nextsong) {
    setNextSong(info.nextsong);
  }
});

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
volumeEl.addEventListener('change', function () {
  console.log('Volume', volumeEl.value);
  setVolume(volumeEl.value);
});

/*
  If the player volume is changed elsewhere in the
  system, change the position of the slider
  to match the new volume
*/
audio.on('volume', function(content) {
  console.log('Volume has changed to ', content.volume);
  setVolumeSlider(content.volume);
});

function setVolumeSlider(volume) {
  volumeEl.value = volume;
}

/*
  When the playlist has changed, rebuild the
  playlist table
*/
var currentPlaylistEl = document.querySelector('#current-playlist table tbody');
player.on('playlist', rebuildPlaylistTable);

function rebuildPlaylistTable(content) {
  var html = '';
  if (content.length === 0) {
    html = '<tr><td colspan="6">Playlist is empty</td></tr>';
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
          +   '<td><i class="indicator fa fa-circle"></i></td>'
          +   '<td>' + item.Pos + '</td>'
          +   '<td>' + (item.Name || item.Title || '') + '</td>'
          +   '<td>' + (item.Artist || '') + '</td>'
          +   '<td>' + '00:00' + '</td>'
          +   '<td><button class="remove no-button" data-pos="' + item.Pos + '"><i class="fa fa-times-circle"></i></button></td>'
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
  Show the current and next songs on the playlist
*/
function setCurrentSong(position) {
  clearCurrentSong();
  var row = currentPlaylistEl.children[position];
  if (row) {
    row.classList.add('is-current');
  }
}

function clearCurrentSong() {
  var row = currentPlaylistEl.querySelector('.is-current');
  if (row) {
    row.classList.remove('is-current');
  }
}

function setNextSong(position) {
  clearNextSong();
  var row = currentPlaylistEl.children[position];
  if (row) {
    row.classList.add('is-next');
  }
}

function clearNextSong() {
  var row = currentPlaylistEl.querySelector('.is-next');
  if (row) {
    row.classList.remove('is-next');
  }
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
  var results = evt.results,
      html = '';

  if (results.length === 0) {
    html = '<tr><td colspan="5">No search results</td></tr>';
  } else {
    html = evt.results.map(createSearchRowForItem).join('');
  }

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
  Live streams list
*/
var streamsEl = document.querySelector('.streams');
window.getJSON(
  'http://bbcradioservices.pixelblend.co.uk/services.json',
  buildServicesList
);

function buildServicesList(json) {
  streamsEl.innerHTML = json.services
                            .map(createServiceListItem)
                            .join('');
}

function createServiceListItem(service) {
  if (service.audioStreams.length > 0) {
    return '<li>'
          +   '<a href="' + service.audioStreams[0].url + '">'
          +     '<img src="' + service.logos.active + '" />'
          +     '<span>'
          +       '<i class="fa fa-plus-circle"></i> '
          +       (service.nowAndNext[0].brand || '')
          +     '</span>'
          +   '</a>'
          + '</li>';
  } else {
    return '';
  }
}

// Add stream to the playlist on click
streamsEl.addEventListener('click', handleAddStream);

function handleAddStream(evt) {
  var targetEl = evt.target,
      url;

  // Prevent any links being followed
  evt.preventDefault();

  // This will run for any click on the streams list element
  // If the parent of the element clicked is the anchor, then
  // set the parent as the target
  if (targetEl.parentNode.nodeName === 'A') {
    targetEl = targetEl.parentNode;
  }

  // If the target is the anchor then add to the playlist
  if (targetEl.nodeName === 'A') {
    url = targetEl.getAttribute('href');
  }

  console.log(targetEl, targetEl.parentNode, url);

  if (url) {
    addToPlaylist(url).then(play);
  }
}

// Get status to do an initial update of
// the user interface
player.status()
      .then(function (status) {
        if (status.playlist) {
          rebuildPlaylistTable(status.playlist);
        }
        if (status.player.state && status.player.state === 'play') {
          setPlayState();
        } else {
          setPauseState();
        }

        if (status.player.song) {
          setCurrentSong(status.player.song);
        }

        if (status.player.nextsong) {
          setNextSong(status.player.nextsong);
        }
      });

audio.status()
      .then(function (status) {
          if (status.volume) {
            setVolumeSlider(status.volume);
          }
      });
