var player = radiodan.player.create(1);
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
});
