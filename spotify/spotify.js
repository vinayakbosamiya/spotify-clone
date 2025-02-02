
let currentSong = new Audio();
let songs;
let curentFolder;


async function getsongs(folder) {
    curentFolder = folder;
    let song = await fetch(`/${folder}`)
    // let song = await fetch(`http://127.0.0.1:5500/${folder}`)
    let response = await song.text(); // get the response in text format
    // console.log(response)
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
   songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            // console.log(index, element.href) // print the index and the href of the element
            songs.push(element.href.split(`/${folder}/`)[1])

        }
    }
    let songul = document.querySelector(".songList").getElementsByTagName("ul")[0] // get the ul tag from the songList class and get the first ul tag and store in the songul variable
    songul.innerHTML = " "
    // OR     // full code   // let songuls = document.querySelector(".songList").getElementsByTagName("ul");  // let songul = songuls[0];

    // console.log(`${song.replaceAll("%20", " ")}`)
    for (const song of songs) {
        songul.innerHTML += `<li> <img src="svg/music.svg" alt="music" class="invert">
                            <div class="info">
                                <div> ${song.replaceAll("%20", " ")}</div>
                                <!-- <div>Rajesh Ahir</div>-->  <!-- this is song artist-->
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                 <img id = "played-paused"src="svg/play.svg" class="invert playlogo" alt="">
                            </div>
                                </li>`
                            }


    // attach an event listener to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            playMusic(e.querySelector(".info > div").innerHTML.trim())
        })
    });

    return songs

}
// let audio = new Audio("/songs/" + track)
const playMusic = (track, pause = false) => {
    currentSong.src = `/${curentFolder}/` + track // set the source of the audio 
    if (!pause) {
        play.src = "svg/pause.svg";
        currentSong.play();
    }
    document.querySelector(".songinfo").innerHTML = track.replaceAll("%20", " ") // or decodeURI(track) decodeURI is function which is used to decode the URI  
    document.querySelector(".songtime").innerHTML = "0:00 / 0:00 "
}

async function displayallalbums() {
    let song = await fetch(`/songs/`)
    // let song = await fetch(`http://127.0.0.1:5500/songs/`)
    let response = await song.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let anchor = div.getElementsByTagName("a")
    let cardcontainer = document.querySelector(".cardContainer")

   let array = Array.from(anchor)

        for (let index = 0; index < array.length; index++) 
        {
            const e = array[index];
            
          if(e.href.includes("/songs/"))
            {

             let folders = (e.href.split("/").slice(4)[0])
             console.log(folders)
             // get the metadata at the folder
             let song = await fetch(`/songs/${folders}/folderInformation.json`)
            //  let song = await fetch(`http://127.0.0.1:5500/songs/${folders}/folderInformation.json`)
             let response = await song.json();
             cardcontainer.innerHTML += ` <div   data-folder=${folders} class="card">
                        <div class="play">
                            <svg width="18" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" stroke-width="1.5"
                                    stroke-linejoin="round" />
                            </svg>
                        </div>

                        <img src="/songs/${folders}/cover.jpg" alt="cover"'>
                        <h2>${response.title}</h2>
                        <p>${response.discription}</p>

                    </div>`
            }
        }
        // add an event listener to the card and loard the songs in the card

        Array.from(document.getElementsByClassName("card")).forEach(e => {
            // console.log(e)
            e.addEventListener("click", async items => {
                songs = await getsongs(`songs/${items.currentTarget.dataset.folder}`)
                playMusic(songs[0])
            })
        });
}

async function main() {

    // get songs
  await getsongs("songs/Pushpa2");
    playMusic(songs[0], true)

// display all albums on the page
displayallalbums()

    // Attech an event listener to play song and pause song
    play.addEventListener("click", togglePlayPause);

document.addEventListener("keydown", (event) => {
    if (event.key === " " || event.keyCode === 32) { 
        event.preventDefault(); // Prevents scrolling when spacebar is pressed
        togglePlayPause();
    }
});

function togglePlayPause() {
    if (currentSong.paused) {
        play.src = "svg/pause.svg";
        currentSong.play();
    } else {
        play.src = "svg/play.svg";
        currentSong.pause();
    }
}

//     play.addEventListener("click", () => {
//         if (currentSong.paused) {
//             play.src = "svg/pause.svg"
//             currentSong.play()
//         }
//         else {
//             play.src = "svg/play.svg"
//             currentSong.pause()
//         }

//     })

//    play.addEventListener("click", togglePlayPause);

// document.addEventListener("keydown", (event) => {
//     if (event.key === " " || event.keyCode === 32) { 
//         event.preventDefault(); // Prevent scrolling when spacebar is pressed
//         togglePlayPause();
//     }
// });

// function togglePlayPause() {
//     if (currentSong.paused) {
//         play.src = "svg/pause.svg";
//         currentSong.play();
//     } else {
//         play.src = "svg/play.svg";
//         currentSong.pause();
//     }
// }

    // this function is convert to seconds to minutes : seconds

    function convertSecondsToTime(seconds) {
        if (isNaN(seconds) || seconds < 0) {
            return '00:00';
        }
        // Calculate minutes and remaining seconds
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);

        // Add leading zeros to minutes and seconds
        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(remainingSeconds).padStart(2, '0');

        return `${formattedMinutes}:${formattedSeconds}`;
    }

    // Listen for the timeupdate event
    currentSong.addEventListener('timeupdate', () => {
        document.querySelector(".songtime").innerHTML = `${convertSecondsToTime(currentSong.currentTime)} / ${convertSecondsToTime(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + '%'
    });

    // event listener for the seekbar line 
    // this is very hard to understand this logic in this code
    // console.log("this is offsetX = ",e.offsetX, "this is  target = ",e.target.getBoundingClientRect().width)
    document.querySelector('.seekbar').addEventListener('click', (e) => {
        let percentage = (e.offsetX / e.target.getBoundingClientRect().width) * 100; // this is calculate seecbar line in percentage
        document.querySelector(".circle").style.left = percentage + "%"; // this is set in the circle in percentage
        currentSong.currentTime = (currentSong.duration * percentage) / 100; // this is set the current time with percentage 


    })

    // lets addeventlitener to the menubar
    document.querySelector(".menu").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0px"

    })

    document.querySelector(".cross").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%";
    })

    // add an event listener to previous and next button
    previous.addEventListener("click", () => {
        
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }
    })
    

    next.addEventListener("click", () => {

        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length ) { 
            // console.log("this is index = ", index +1, "this is length = ", songs.length)
            playMusic(songs[index + 1])
        }
    })

    // add an event listener to the volume button
    const input= document.querySelector(".range").getElementsByTagName("input")[0]
    input.addEventListener("change",(e)=>{
        console.log("setting volume to = ",e.target.value,"/100")
        let setvolume = currentSong.volume = parseInt(e.target.value) / 100
    })

    let vol = document.querySelector(".volume > img").addEventListener("click", e=>{
        console.log(e.target.src)
        if(e.target.src.includes("svg/volume.svg")){
            e.target.src = e.target.src.replace("svg/volume.svg","svg/mute.svg");
            currentSong.volume = 0
            input.value = 0;
        }
        else{
            e.target.src = e.target.src.replace("svg/mute.svg","svg/volume.svg");
            currentSong.volume = .10
            input.value = .10;
           
        }

    })
    
}

main()
















































































// // try {
// // return songs

// // } catch (error) {
// //     console.log(error)
// // }
// // finally{
// //     console.log(songs)
// // }

// // const v = document.querySelector(".")

// // console.log("let's start spotify javascript");































































// let currentSong = new Audio();
// let songs;
// let curentFolder;


// async function getsongs(folder) {
//     curentFolder = folder;
//     let song = await fetch(`http://127.0.0.1:5500/${folder}`)
//     let response = await song.text(); // get the response in text format
//     // console.log(response)
//     let div = document.createElement("div");
//     div.innerHTML = response;
//     let as = div.getElementsByTagName("a")
//    songs = [];
//     for (let index = 0; index < as.length; index++) {
//         const element = as[index];
//         if (element.href.endsWith(".mp3")) {
//             // console.log(index, element.href) // print the index and the href of the element
//             songs.push(element.href.split(`/${folder}/`)[1])

//         }
//     }
//     let songul = document.querySelector(".songList").getElementsByTagName("ul")[0] // get the ul tag from the songList class and get the first ul tag and store in the songul variable
//     songul.innerHTML = " "
//     // OR     // full code   // let songuls = document.querySelector(".songList").getElementsByTagName("ul");  // let songul = songuls[0];

//     // console.log(`${song.replaceAll("%20", " ")}`)
//     for (const song of songs) {
//         songul.innerHTML += `<li> <img src="svg/music.svg" alt="music" class="invert">
//                             <div class="info">
//                                 <div> ${song.replaceAll("%20", " ")}</div>
//                                 <!-- <div>Rajesh Ahir</div>-->  <!-- this is song artist-->
//                             </div>
//                             <div class="playnow">
//                                 <span>Play Now</span>
//                                  <img id = "played-paused"src="svg/play.svg" class="invert playlogo" alt="">
//                             </div>
//                                 </li>`
//                             }


//     // attach an event listener to each song
//     Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
//         e.addEventListener("click", element => {
//             playMusic(e.querySelector(".info > div").innerHTML.trim())
//         })
//     });

//     return songs

// }
// // let audio = new Audio("/songs/" + track)
// const playMusic = (track, pause = false) => {
//     currentSong.src = `/${curentFolder}/` + track // set the source of the audio 
//     if (!pause) {
//         play.src = "svg/pause.svg";
//         currentSong.play();
//     }
//     document.querySelector(".songinfo").innerHTML = track.replaceAll("%20", " ") // or decodeURI(track) decodeURI is function which is used to decode the URI  
//     document.querySelector(".songtime").innerHTML = "0:00 / 0:00 "
// }

// async function displayallalbums() {
//     let song = await fetch(`http://127.0.0.1:5500/songs/`)
//     let response = await song.text();
//     let div = document.createElement("div");
//     div.innerHTML = response;
//     let anchor = div.getElementsByTagName("a")
//     let cardcontainer = document.querySelector(".cardContainer")

//    let array = Array.from(anchor)

//         for (let index = 0; index < array.length; index++) 
//         {
//             const e = array[index];
            
//           if(e.href.includes("/songs/"))
//             {

//              let folders = (e.href.split("/").slice(4)[0])
//              console.log(folders)
//              // get the metadata at the folder
//              let song = await fetch(`http://127.0.0.1:5500/songs/${folders}/folderInformation.json`)
//              let response = await song.json();
//              cardcontainer.innerHTML += ` <div   data-folder=${folders} class="card">
//                         <div class="play">
//                             <svg width="18" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                                 <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" stroke-width="1.5"
//                                     stroke-linejoin="round" />
//                             </svg>
//                         </div>

//                         <img src="/songs/${folders}/cover.jpg" alt="cover"'>
//                         <h2>${response.title}</h2>
//                         <p>${response.discription}</p>

//                     </div>`
//             }
//         }
//         // add an event listener to the card and loard the songs in the card

//         Array.from(document.getElementsByClassName("card")).forEach(e => {
//             // console.log(e)
//             e.addEventListener("click", async items => {
//                 songs = await getsongs(`songs/${items.currentTarget.dataset.folder}`)
//                 playMusic(songs[0])
//             })
//         });
// }

// async function main() {

//     // get songs
//   await getsongs("songs/Pushpa2");
//     playMusic(songs[0], true)

// // display all albums on the page
// displayallalbums()

//     // Attech an event listener to play song and pause song
//     play.addEventListener("click", () => {
//         if (currentSong.paused) {
//             play.src = "svg/pause.svg"
//             currentSong.play()
//         }
//         else {
//             play.src = "svg/play.svg"
//             currentSong.pause()
//         }

//     })

//     // this function is convert to seconds to minutes : seconds

//     function convertSecondsToTime(seconds) {
//         if (isNaN(seconds) || seconds < 0) {
//             return '00:00';
//         }
//         // Calculate minutes and remaining seconds
//         const minutes = Math.floor(seconds / 60);
//         const remainingSeconds = Math.floor(seconds % 60);

//         // Add leading zeros to minutes and seconds
//         const formattedMinutes = String(minutes).padStart(2, '0');
//         const formattedSeconds = String(remainingSeconds).padStart(2, '0');

//         return `${formattedMinutes}:${formattedSeconds}`;
//     }

//     // Listen for the timeupdate event
//     currentSong.addEventListener('timeupdate', () => {
//         document.querySelector(".songtime").innerHTML = `${convertSecondsToTime(currentSong.currentTime)} / ${convertSecondsToTime(currentSong.duration)}`
//         document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + '%'
//     });

//     // event listener for the seekbar line 
//     // this is very hard to understand this logic in this code
//     // console.log("this is offsetX = ",e.offsetX, "this is  target = ",e.target.getBoundingClientRect().width)
//     document.querySelector('.seekbar').addEventListener('click', (e) => {
//         let percentage = (e.offsetX / e.target.getBoundingClientRect().width) * 100; // this is calculate seecbar line in percentage
//         document.querySelector(".circle").style.left = percentage + "%"; // this is set in the circle in percentage
//         currentSong.currentTime = (currentSong.duration * percentage) / 100; // this is set the current time with percentage 


//     })

//     // lets addeventlitener to the menubar
//     document.querySelector(".menu").addEventListener("click", () => {
//         document.querySelector(".left").style.left = "0px"

//     })

//     document.querySelector(".cross").addEventListener("click", () => {
//         document.querySelector(".left").style.left = "-120%";
//     })

//     // add an event listener to previous and next button
//     previous.addEventListener("click", () => {
        
//         let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
//         if ((index - 1) >= 0) {
//             playMusic(songs[index - 1])
//         }
//     })
    

//     next.addEventListener("click", () => {

//         let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
//         if ((index + 1) < songs.length ) { 
//             // console.log("this is index = ", index +1, "this is length = ", songs.length)
//             playMusic(songs[index + 1])
//         }
//     })

//     // add an event listener to the volume button
//     const input= document.querySelector(".range").getElementsByTagName("input")[0]
//     input.addEventListener("change",(e)=>{
//         console.log("setting volume to = ",e.target.value,"/100")
//         let setvolume = currentSong.volume = parseInt(e.target.value) / 100
//     })

//     let vol = document.querySelector(".volume > img").addEventListener("click", e=>{
//         console.log(e.target.src)
//         if(e.target.src.includes("svg/volume.svg")){
//             e.target.src = e.target.src.replace("svg/volume.svg","svg/mute.svg");
//             currentSong.volume = 0
//             input.value = 0;
//         }
//         else{
//             e.target.src = e.target.src.replace("svg/mute.svg","svg/volume.svg");
//             currentSong.volume = .10
//             input.value = .10;
           
//         }

//     })
    
// }

// main()
















































































// // // try {
// // // return songs

// // // } catch (error) {
// // //     console.log(error)
// // // }
// // // finally{
// // //     console.log(songs)
// // // }

// // // const v = document.querySelector(".")

// // // console.log("let's start spotify javascript");

