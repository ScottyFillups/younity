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
    videoId: 'cMg8KaMdDYo',
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}
function noBroadcast(player, methodName, args) {
  broadcast = false;
  console.log('broadcast off');
  if (args !== undefined) {
    player[methodName].apply(player, args);
  } else {
    player[methodName]();
  }
  // add a delay to let function call before broadcast is set to true
  setTimeout(function() {
    console.log('broadcasting back on');
    broadcast = true;
  }, 500);
}
function onPlayerReady(event) {
  socket = io();
  socket.on('paused', function() {
    noBroadcast(player, 'pauseVideo');
  });
  socket.on('playing', function() {
    noBroadcast(player, 'playVideo');
  });
  socket.on('buffering', function(time) {
    if (time === undefined || time === null) {
      time = 0;
    }
    noBroadcast(player, 'seekTo', [time, true]);
  });
  socket.on('load', function(url) {
    noBroadcast(player, 'cueVideoById', [youtube_parser(url)]);
  });
  $('.idSubmit').click(function() {
    var url = $('#vidId').val();
    noBroadcast(player, 'cueVideoById', [youtube_parser(url)]);
    socket.emit('load', url);
  });
  $('.idSubmit').prop('disabled', false);
}

function onPlayerStateChange(event) {
  if (broadcast) {
    console.log('broadcasting: ' + event.data);
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
      case YT.PlayerState.BUFFERING:
        socket.emit('buffering', player.getCurrentTime());
        break;
      case YT.PlayerState.CUED:
        socket.emit('cued');
        break;
    }
  }
}

/**
* Get YouTube ID from various YouTube URL
* @author: takien
* @url: http://takien.com
* For PHP YouTube parser, go here http://takien.com/864
*/

function youtube_parser(url){
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    var match = url.match(regExp);
    return (match&&match[7].length==11)? match[7] : false;
}
