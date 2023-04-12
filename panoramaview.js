/*
panorama view
2023 kasumi


*/
var urls = ['sample.png'];
var viewPosition = 0;
const moveCoe = 1;
var viewImg = document.getElementById("viewImg");
viewImg.style.rotate = '50deg';
document.addEventListener("DOMContentLoaded", function (event) {
    var viewImg = document.getElementById("viewImg");
    //var move = document.getElementById("move");
    window.addEventListener("devicemotion", function (event) {
        const cStyle = window.getComputedStyle(viewImg);
        //move.innerText = event.acceleration.x + "/" + event.acceleration.y;
        viewImg.style.marginLeft = parseInt(cStyle.marginLeft) + ((event.rotationRate.beta) * moveCoe) + 'px';
        viewImg.style.marginTop = parseInt(cStyle.marginTop) + ((event.rotationRate.alpha) * moveCoe) + 'px';
        //viewImg.style.rotate = parseInt(cStyle.rotate) + ((event.rotationRate.gamma * 60)) + 'deg';
        //move.innerText = event.acceleration.x + '/' + event.acceleration.y;
        /*        viewImg.style.
                    event.rotationRate.alpha
                    */
    });
    viewImg.src = urls[viewPosition];

    document.getElementById("selmulti").addEventListener('change', function (event) {
        viewPosition = urls.length;
        for (var i = 0; i < event.target.files.length; i++) {
            urls.push(window.URL.createObjectURL(event.target.files[i]));
        }

        viewImg.src = urls[viewPosition];
    });
    document.getElementById("home").addEventListener('click', function (event) {
        viewImg.style.marginLeft = '-200%';
        viewImg.style.marginTop = '-200%';
        first = true;
    });
    document.getElementById("next").addEventListener('click', function (event) {
        if (viewPosition < (urls.length - 1)) {
            viewPosition++;
        }
        viewImg.src = urls[viewPosition];
    });
    document.getElementById("prev").addEventListener('click', function (event) {
        if (viewPosition > 0) {
            viewPosition--;
        }
        viewImg.src = urls[viewPosition];
    });
});

