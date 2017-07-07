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
  socket.on('load', function(url) {
    broadcast = false;
    console.log(url);
    player.loadVideoById(youtube_parser(url));
    broadcast = true;
  });
  $('.idSubmit').click(function() {
    var url = $('#vidId').val();
    broadcast = false;
    console.log(url);
    player.loadVideoById(youtube_parser(url));
    socket.emit('load', url);
    broadcast = true;
  });
  $('.idSubmit').prop('disabled', false);
}

function onPlayerStateChange(event) {
  if (broadcast) {
    console.log('broadcasting');
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


function YouTubeGetID(url){
  var ID = '';
  url = url.replace(/(>|<)/gi,'').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
  if(url[2] !== undefined) {
    ID = url[2].split(/[^0-9a-z_\-]/i);
    ID = ID[0];
  }
  else {
    ID = url;
  }
    return ID;
}


/*function noBroadcast(fn) {
  broadcast = false;
  fn();
  broadcast = true;
}*/

