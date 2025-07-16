console.log("hello world");
let currentsong = new Audio();
let songs;
let currentfolder;
function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}
async function getsongs(folder) {
    currentfolder = folder;
    let a = await fetch(`${folder}`)
    let response = await a.text();
    // console.log(response);
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }
    let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songul.innerHTML = ""
    for (const song of songs) {
        songul.innerHTML = songul.innerHTML + `<li>
                            <img class="invert" src="music.svg" alt="">
                            <div class="info">
                                <div class="songname">${decodeURI(song)} </div>
                                <div>Artist</div>
                            </div>
                            <div class="playnow">
                                <span>Play now</span>
                                <img class= "invert"src="play.svg" alt="">
                            </div>
                          </li>`;

    }
    let lis = document.querySelector(".songlist").getElementsByTagName("li")
    for (let index = 0; index < lis.length; index++) {

        let element = lis[index];
        element.addEventListener("click", e => {
            playMusic(element.querySelector(".info").firstElementChild.innerHTML.trim())
        })

    }
    return songs 
}
    
function playMusic(track, pause=false) {
    currentsong.src = `/${currentfolder}/` + track;
    if(!pause){
        currentsong.play();
        play.src = "pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"

}
async function main() {
    songs = await getsongs("songs/play1");
    playMusic(songs[0], true)
    console.log(songs);

// TO play particular song
    // let audios = new Audio(songs[0]);
    // audios.play();
    // audios.addEventListener("loadeddata", ()=>{
    //   let duration = audios.duration;
    //   console.log(duration)
    // })
    // event listener to the play button
    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play()
            play.src = "pause.svg"

        }
        else {
            currentsong.pause()
            play.src = "play.svg"
        }

    })
    // time update event and seekbar
    currentsong.addEventListener("timeupdate", () => {
        console.log(currentsong.currentTime, currentsong.duration)
        document.querySelector(".songtime").innerHTML = `
        ${secondsToMinutesSeconds(currentsong.currentTime)}/${secondsToMinutesSeconds(currentsong.duration)}`
        document.querySelector(".circle").style.left = (currentsong.currentTime/currentsong.duration)*100 + "%"
    })
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentsong.currentTime = ((currentsong.duration) * percent) / 100
    })
    // event listener to the hamburger
    document.querySelector(".hamburger").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = 0
    })
    // event listener to close the left container
    document.querySelector(".close").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = -130 + "%"
    })
    // previous and next events
    previous.addEventListener("click",()=>{
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        console.log(currentsong.src.split("/").slice(-1)[0])
        console.log(index)
        console.log(songs)
        if((index-1)>=0){
        playMusic(songs[index-1])
        }
    })
    next.addEventListener("click",()=>{
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        console.log(currentsong.src.split("/").slice(-1)[0])
        console.log(index)
        console.log(songs)
        if((index+1) < songs.length){
        playMusic(songs[index+1])
        }
    })
    // volume range
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
         console.log(e.target,e.target.value)
         currentsong.volume = parseInt(e.target.value)/100
    })
    // load the playlist
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        console.log(e)
        e.addEventListener("click", async item=>{
            songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`)
            playMusic(songs[0])
        })
        
    });
  // Add event listener to mute the track
   document.querySelector(".volume>img").addEventListener("click", e=>{ 
         if(e.target.src.includes("volume.svg")){
                e.target.src = e.target.src.replace("volume.svg", "mute.svg")
                currentsong.volume = 0 ;
                document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
            }
         else{
                e.target.src = e.target.src.replace("mute.svg", "volume.svg")
                currentsong.volume = .10;
                document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
            }
    
        })

}
main()


