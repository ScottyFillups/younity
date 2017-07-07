//$(function() {
  var tag = document.createElement('script');

  tag.src = 'https://www.youtube.com/iframe_api';
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  var player;
  function onYouTubeIframeAPIReady() {
    console.log('hello');
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
  }

  function onPlayerStateChange(event) {
  }

  function changeURL() {
    var url = document.getElementById('url').value;
    player.loadVideoById(url);
  }
//});
