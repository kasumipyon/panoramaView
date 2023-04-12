/*
panorama view
2023 kasumi


*/
var urls = ['sample.png'];
var viewPosition = 0;
const moveCoe = 1;
document.addEventListener("DOMContentLoaded", function (event) {
    var viewImg = document.getElementById("viewImg");
    viewImg.style.rotate = '0deg';
    hideAddressBar();
    window.addEventListener("orientationchange", hideAddressBar);
    window.addEventListener("devicemotion", function (event) {
        const cStyle = window.getComputedStyle(viewImg);
        //move.innerText = event.acceleration.x + "/" + event.acceleration.y;

        let angle = screen && screen.orientation && screen.orientation.angle;
        if (angle === undefined) {
            angle = window.orientation;    // iOS用
        }
        let nowCoe = moveCoe / window.devicePixelRatio;
        if (angle == 0 || angle == 180) {
            viewImg.style.marginLeft = parseInt(cStyle.marginLeft) + ((event.rotationRate.beta) * nowCoe) + 'px';
            viewImg.style.marginTop = parseInt(cStyle.marginTop) + ((event.rotationRate.alpha) * nowCoe) + 'px';
        } else {
            viewImg.style.marginLeft = parseInt(cStyle.marginLeft) + ((event.rotationRate.alpha) * nowCoe) + 'px';
            viewImg.style.marginTop = parseInt(cStyle.marginTop) + ((event.rotationRate.beta) * nowCoe) + 'px';
        }


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

function hideAddressBar () {
    document.body.style.height = "3000px";	//ダミーの高さを設定
    document.body.style.minHeight = "";

    setTimeout(function () {
        window.scrollTo(0, 1);	//アドレスバーを隠す

        setTimeout(function () {
            //bodyの最低サイズを設定
            document.body.style.minHeight = window.innerHeight + document.body.scrollTop + "px";
            document.body.style.height = "auto";	//高さを戻す
        }, 500);
    }, 100);
}
