function play() {
  player.play();
}

function pause() {
  player.pause({ value: true });
}

function nextTrack() {
  player.next();
}

function previousTrack() {
  player.previous();
}

function setVolume(vol) {
  player.volume({ value: vol });
}

function clearPlaylist() {
  player.clear();
}

function addToPlaylist(path) {
  player.add({ playlist: [ path ]});
}

function removeFromPlaylist(position) {
  player.remove({ position: position });
}
