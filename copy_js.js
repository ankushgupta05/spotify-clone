console.log("Lets write JavaScript");

let currentSong = new Audio();
let songs;
let currFolder;


// This code teken by chatgpt
function convertSecondsToMinutesAndSeconds(seconds) {

    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const formattedTime = `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    return formattedTime;
}

// // Example usage:
// const seconds = 125;
// const formattedTime = convertSecondsToMinutesAndSeconds(seconds);
// console.log(formattedTime); // Output: "2:05"





async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`http://127.0.0.1:5500/${folder}/`)
    let response = await a.text();
    // console.log(response)
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    // console.log(as)

     songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            // songs.push(element.href) // note this line push karenga ek entire url ko
            // console.log(element.href)

            // below line divide into two part 1st part before songs and 2nd after songs  and index[0] indicate 1st part and index[1] indicate 2nd part of url
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }


    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]  // index 0  likha hai matlab ki songlisi ke 1st ul mai data save honga
    songUL.innerHTML = ""
    for (const song of songs) {
        // songUL.innerHTML = songUL.innerHTML + song; // all song are added without breaking point  
        songUL.innerHTML = songUL.innerHTML + `<li>  
                       
                                <img class="invert" src="images/music.svg" alt="">
                                <div class="info">
                                    <div>${song.replaceAll("%20", " ")}</div>
                                    <div>Ankush artist</div>
                                </div>
                                <div class="playnow">
                                    <span>Play Now</span>
                                    <img class="invert" src="images/play music.svg" alt="">
                                </div>
        
        
                    </li>`;
        // all songs are added with breaking point in buletLine form and sath hi remove  karega '%20' is  word ko. lekin yaha replace kaam nahi kar raha so that you find error

    }



    /* 

            // play the 1st songs
            var audio = new Audio(songs[0])
            // audio.play();
    */

    /* 
    //  this code calculate time and taken by 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio#examples' 
    audio.addEventListener("loadeddata", () => {
        
        let duration = audio.duration;
        console.log(audio.duration, audio.currentSrc)
    })
    */



    console.log("hyyyyyy")
    // attach an event listner to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            // console.log(e.querySelector(".info").firstElementChild.innerHTML);
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())  // trim () remove the extra space from both side before and after


        })
    })

    return songs
}



const playMusic = (track, pause = false) => {



    // console.log("track =  ",track)
    // let  audio = new Audio("/songs/" + track)
    // console.log(audio)
    // console.log(currentSong.src)
    currentSong.src = `/${currFolder}` + track;
    if (!pause) {
        currentSong.play()
        play.src = "pause.svg";
    }
    // console.log(currentSong.src)

    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";

    
}




// upper wala function return kar raha hai prommise kyoki upper wala function async hai is liye niche wala function defind kiya hai.

async function main() {


    // let currentSong = new Audio();  // this variable making global


    // Get the list of all the songs
    // let songs = await getSongs("songs/ncs");
    await getSongs("songs/ncs");
    // console.log(songs)

    playMusic(songs[0], true)

    // show all the songs in the playlist
   
    // Attach an event Listener to play , next and previous
    play.addEventListener("click", () => {

        if (currentSong.paused) {
            currentSong.play()
            play.src = "images/pause.svg";
        }
        else {
            currentSong.pause();
            play.src = "images/play music.svg";
        }
    })

    // Listen for timeupdate event
    currentSong.addEventListener("timeupdate", () => {
        // console.log(currentSong.currentTime, currentSong.duration)
        document.querySelector(".songtime").innerHTML = `${convertSecondsToMinutesAndSeconds(currentSong.currentTime)} / ${convertSecondsToMinutesAndSeconds(currentSong.duration)}`

        // coding for moving circle of seekbar

        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + '%';
    })


    // coding for moving circle of seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        // console.log(e.target, e.offsetX)
        // NOTE :- getBoundingClientRect()  give information about width

        // 'e.target.getBoundingClientRect().width' this word give width of seekbar
        // console.log(e.target.getBoundingClientRect().width, e.offsetX)


        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + '%';
        currentSong.currentTime = ((currentSong.duration) * percent) / 100;
    })

    // Add an event listtener for hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = 0
    })

    // Add an event listtener for close button
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%";
    })


    //  Add an event listerner to previous ad next
    previous.addEventListener("click", () => {
        console.log("Previous click")
        console.log(currentSong)

        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])  // ye line index find karenga ki songs mai kon se index par khana rakha hai
        // console.log(index)  // it give index 
        // console.log(songs, index)

        if ((index - 1) > 0) {
            console.log(index, length)  // length is a keyword and it containt 0 value 
            playMusic(songs[index - 1])  // this line play song of current song
        }

    })


    //  Add an event listerner to next ad next
    next.addEventListener("click", () => {
        console.log("next click")
        /* 
        console.log(currentSong.src.split("/"))  // ye line current song ke url ko splid kar denga '/' ke according aur ek array mai value ko return karenga
        console.log(currentSong.src.split("/").slice(-1))  // ye line url ka splid kiya hua part ka only last part denga
        console.log(currentSong.src.split("/").slice(-1)[0]) //  url ka last part array mai rakha hai to ye line last part ko array se bhahar nikaalega
        console.log(songs)   // isme sabhi song save hai only song ke naam 
        */

        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])  // ye line index find karenga ki songs mai kon se index par khana rakha hai
        // console.log(index)  // it give index 
        // console.log(songs, index)

        if ((index + 1) < songs.length) {
            console.log(index, length)
            playMusic(songs[index + 1])  // this line play song of current song
        }
    })


    // Add an event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        // console.log(e , e.target, e.target.value)  //  e.target  input tag ko target kar raha hai aur e.target.value  humko value de raha hai ki kaha click kiya hai

        console.log("Setting volume to", e.target.value, "/ 100")
        currentSong.volume = parseInt(e.target.value) / 100  // volume hamesha 0 se 1 tak hi raha hai ab volume bhi change honga
        // console.log(parseInt(e.target.value)/100)  // 0 se 1 ke bich mai number de raha hai
    })


    // Load the playlist whenever card id clicked

    Array.from(document.getElementsByClassName("card")).forEach( e =>{
        // console.log(e)
        e.addEventListener("click", async item=>{
            console.log(item, item.currentTarget.dataset)   // currentTarget jaruri hai phir useke baad tum card ke kisi part mai bhi click karte ho to aapka event listener work karenga. 
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
            
        })
    } )


}


main()
