var socket = io();

// 2. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);


// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;
var duration;

function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '450',
        width: '800',
        videoId: 'acvIVA9-FMQ',
        events: {
          'onReady': onPlayerReady,
          'onStateChange': onPlayerStateChange
        },
        playerVars: {
            controls: 0,
            disablekb: 1,
            modestbranding: 1,
            rel: 0,
            showinfo: 0,
            autoplay: 0
        }
    });
}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
    
}

// 5. The API calls this function when the player's state changes.
function onPlayerStateChange(event) {
    if (event.data == 1) {
        duration = player.getDuration()

        setInterval(function() {
            var currentTime = player.getCurrentTime()
            var marginLeft = -(((duration - currentTime) / duration) * 669) - 10

            document.getElementById("square").style.marginLeft = marginLeft.toString() + "px"
        }, 200)   
    }
}


document.getElementById("play").addEventListener("click", function() {
    socket.emit("playerEvent", "play")
})

document.getElementById("pause").addEventListener("click", function() {
    socket.emit("playerEvent", "pause")
})

document.getElementById("search_btn").addEventListener("click", function() {
    socket.emit("videoEvent", document.getElementById("vid_id_input").value)
})


var player_line = document.getElementById("line")
var line_rect = player_line.getBoundingClientRect()

player_line.addEventListener("click", function(event) {
    if (typeof duration == "undefined") {
        duration = player.getDuration()
    }

    var x = event.clientX - line_rect.left
    var left = 0
    var right = line_rect.right - line_rect.left

    var seekTime = (x / right) * duration

    if (event.clientX == line_rect.left) {
        seekTime = 0
    }

    socket.emit("playerEvent", {
        event: "seek",
        time: seekTime
    })
})

socket.on('playerEvent', function(event) {
    if (event == 'play') {
        player.playVideo()
    }
    else if (event == 'pause') {
        player.pauseVideo()
    }
    else if (event.event == 'seek') {
        player.seekTo(event.time, true)
    }
})

socket.on("videoEvent", function(event) {
    player.loadVideoById(event)
    document.getElementById("vid_id_input").value = ""
})
