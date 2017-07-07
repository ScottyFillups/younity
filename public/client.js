var player;
var socket;
var broadcast = true;
var tag = document.createElement('script');

tag.src = 'https://www.youtube.com/iframe_api';
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

function onYouTubeIframeAPIReady() {
  player = new YT.Player('ytVid', {
    height: '530',
    width: '942',
    videoId: 'M7lc1UVf-VE',
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}
function onPlayerReady(event) {
  socket = io();
  socket.on('paused', function() {
    broadcast = false; 
    player.pauseVideo();
    broadcast = true;
  });
  socket.on('playing', function() {
    broadcast = false;
    player.playVideo();
    broadcast = true;
  });
  //i'll tweak it later
  socket.on('buffering', function(time) {
    broadcast = false;
    player.seekTo(time, true);
    player.playVideo();
    broadcast = true;
  });
}

function onPlayerStateChange(event) {
  if (broadcast) {
    switch(event.data) {
      case YT.PlayerState.UNSTARTED:
        socket.emit('unstarted');
        break;
      case YT.PlayerState.ENDED:
        socket.emit('ended');
        break;
      case YT.PlayerState.PLAYING:
        socket.emit('playing');
        break;
      case YT.PlayerState.PAUSED:
        socket.emit('paused');
        break;
      case YT.PlayerState.BUFFERING:
        socket.emit('buffering', player.getCurrentTime());
        break;
      case YT.PlayerState.CUED:
        socket.emit('cued');
        break;
    }
  }
}

function changeURL() {
  var url = document.getElementById('url').value;
  player.loadVideoById(url);
}
/*function noBroadcast(fn) {
  broadcast = false;
  fn();
  broadcast = true;
}*/

