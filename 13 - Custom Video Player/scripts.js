const player = document.querySelector('.player');
const video = player.querySelector('.viewer');
const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');
const toggle = player.querySelector('.toggle');
const skipButtons = player.querySelectorAll('[data-skip]');
const ranges = player.querySelectorAll('.player__slider');

//build our functions

function togglePlay() {
    //either play or pause
    if (video.paused) {
        video.play();
    } else {
        video.pause();
    }
}

function skip(e) {
    console.log("skipping");
    const secs = this.dataset.skip;
    console.log(this);
    console.log(`skipping for ${secs}`);

    video.currentTime += parseFloat(secs);

}

function updateButton() {
    console.log("update the button");
    const icon = this.paused ? '►' : '❚ ❚';
    console.log(icon);
    toggle.textContent = icon;
}

function handleRangeUpdate(e) {
    console.log("updating range");

    //we were smart enough to keep the name of input range, same as the name of the video attributes
    video[this.name] = this.value;
}

function handleProgress() {
    //we will be updating the flex-basis value, which sort of corresponds with the width of the video
    const percentage = (video.currentTime / video.duration) * 100;
    progressBar.style.flexBasis = `${percentage}%`;
}

function scrub(e) {
    //our progress bar has a width of 640 pixels
    console.log(`x pixels : ${e.offsetX}`);

    const time = (e.offsetX / progress.offsetWidth) * video.duration;
    video.currentTime = time;
}
//hook up the event listeners

video.addEventListener('click', togglePlay);

//we could have simply changed the button in togglePlay option, by if-else statement
//but there could be many other reasons of video pausing or playing, suppose a pop up causes the video to //pause, so we attach event listeners to the pause and play event itself

video.addEventListener('play', updateButton);
video.addEventListener('pause', updateButton);

//every time the video progresses, the handleProgress is called
video.addEventListener('progress', handleProgress);
skipButtons.forEach(button => button.addEventListener('click', skip));

ranges.forEach(range => range.addEventListener('change', handleRangeUpdate));
progress.addEventListener('click', scrub);
//to handle the mouse movement

let mousedown = false;
progress.addEventListener('mousedown', () => mousedown = true);
progress.addEventListener('mouseup', () => mousedown = false);

// always remember to pass in the event inside arrow function
progress.addEventListener('mousemove', (e) => {
    if (mousedown) scrub(e);
});