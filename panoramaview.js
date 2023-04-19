/*
panorama view
2023 kasumi
MIT licence

*/
const moveCoe = 1;
var buttonsOut;
document.addEventListener("DOMContentLoaded", function (event) {

    var urls =  ['sample.png'];
    for (let i = 0; i < urls.length; i++) {
        var el = document.createElement("img");
        el.src = urls[i]
        setImgEvent(el);
        document.getElementById('views').insertBefore(el, document.querySelector("#views>button"));
    }


    window.addEventListener("devicemotion", function (event) {
        if (document.querySelector('#views img.viewImg') != null) {
            deviceMotion(event);
        }
    });


    var buttonsOut;
    navChange()


    document.getElementById("file").addEventListener('click', function (event) {
        document.getElementById("selmulti").click();
    });
    document.getElementById("selmulti").addEventListener('change', function (event) {
        for (var i = 0; i < event.target.files.length; i++) {
            var el = document.createElement("img");
            el.src = window.URL.createObjectURL(event.target.files[i]);
            setImgEvent(el);
            document.getElementById('views').insertBefore(el, document.querySelector("#views>button"));

        }
        navChange();
    });
    document.getElementById("next").addEventListener('click', function (event) {
        if (viewPosition < (urls.length - 1)) {
            viewPosition++;
        }
        //viewImg.src = urls[viewPosition];
        buttonResetFadeout();
        navChange()
    });
    document.getElementById("prev").addEventListener('click', function (event) {
        if (viewPosition > 0) {
            viewPosition--;
        }
        viewImg.src = urls[viewPosition];
        navChange()
        buttonResetFadeout();
    });
    document.getElementById("delete").addEventListener('click', function (event) {
        event.target.remove();
        if (document.fullscreenElement !== null) {
            document.exitFullscreen();
        }
    });

    document.getElementById("exit").addEventListener('click', function (event) {
        const img = document.querySelector("img.viewImg");
        img.classList.remove('viewImg');
        document.querySelector("div.buttons").classList.add('hidden');
        img.style.width = null;
        img.style.marginTop = null;
        img.style.marginLeft = null;
        if (document.fullscreenElement !== null) {
            document.exitFullscreen();
        }
    });


});

function setImgEvent(img) {
    img.addEventListener('click', function (event) {
        if (img.classList.contains('viewImg')) {
            buttonResetFadeout();
        } else {
            if (isSmartPhone()) {
                document.documentElement.requestFullscreen();
            }
            if (isiPhone()) {
                requestDeviceMotionPermission();
            }
            img.classList.add('viewImg');

            buttonResetFadeout();
            adjustSize(img);
        }
    });
}


function adjustSize(img) {
    var mWidth = screen.width;
    if (screen.orientation.angle == 0) {
        mWidth = screen.height;
    }

    if (img.naturalWidth > img.naturalHeight) {
        img.style.width = mWidth * (img.naturalWidth / img.naturalHeight) * 3 + 'px';
    } else {
        img.style.width = mWidth * 2 + 'px';
    }
    img.style.marginLeft = ((img.clientWidth - screen.width) / 2) * -1 + 'px';
    img.style.marginTop = ((img.clientHeight - screen.height) / 2) * -1 + 'px';
}





function isiPhone() {
    if (navigator.userAgent.match(/iPad|iPhone|iPod/)) {
        return true;
    } else {
        return false;
    }
}
function isSmartPhone() {
    if (navigator.userAgent.match(/iPhone|Android.+Mobile/)) {
        return true;
    } else {
        return false;
    }
}
const requestDeviceMotionPermission = () => {
    if (
        DeviceMotionEvent &&
        typeof DeviceMotionEvent.requestPermission === 'function'
    ) {
        // iOS 13+ の Safari
        // 許可を取得
        DeviceMotionEvent.requestPermission()
            .then(permissionState => {
                if (permissionState === 'granted') {
                    // 許可を得られた場合、devicemotionをイベントリスナーに追加
                    /*window.addEventListener('devicemotion', e => {
                        // devicemotionのイベント処理
                        deviceMotion(e);
                    })*/
                } else {
                    // 許可を得られなかった場合の処理
                }
            })
            .catch(console.error) // https通信でない場合などで許可を取得できなかった場合
    } else {
        // 上記以外のブラウザ
    }
}

function navChange() {
    const length = document.querySelectorAll('#views img').length;
    viewPosition = 0;
    if ((viewPosition == 0) & (length <= (viewPosition + 1))) {
        document.getElementById("prev").style.opacity = '0';
        document.getElementById("next").style.opacity = '0';
    } else if (viewPosition == 0) {
        document.getElementById("prev").style.opacity = '0';
        document.getElementById("next").style.opacity = '1';
    } else if (length <= (viewPosition + 1)) {
        document.getElementById("prev").style.opacity = '1';
        document.getElementById("next").style.opacity = '0';
    } else {
        document.getElementById("prev").style.opacity = '1';
        document.getElementById("next").style.opacity = '1';
    }
}
function buttonResetFadeout() {
    const buttonsEl = document.querySelector("div.buttons");
    buttonsEl.classList.remove('hidden');
    buttonsEl.classList.remove('fadeout');
    clearInterval(buttonsOut);
    buttonsOut = setTimeout(function () {
        buttonsEl.classList.add('fadeout');
    }, 2000);
}
function deviceMotion(event) {
    const viewImg = document.querySelector('#views img.viewImg');
    const cStyle = window.getComputedStyle(viewImg);
    //move.innerText = event.acceleration.x + "/" + event.acceleration.y;

    let angle = screen && screen.orientation && screen.orientation.angle;
    if (angle === undefined) {
        angle = window.orientation;    // iOS用
    }

    let nowCoe = (moveCoe * (document.body.clientWidth / window.innerWidth)) * 1;
    if (angle == 0 || angle == 180) {
        viewImg.style.marginLeft = parseInt(cStyle.marginLeft) + parseInt((event.rotationRate.beta) * nowCoe) + 'px';
        viewImg.style.marginTop = parseInt(cStyle.marginTop) + parseInt((event.rotationRate.alpha) * nowCoe) + 'px';
    } else {
        viewImg.style.marginLeft = parseInt(cStyle.marginLeft) + ((event.rotationRate.alpha) * nowCoe) + 'px';
        viewImg.style.marginTop = parseInt(cStyle.marginTop) - ((event.rotationRate.beta) * nowCoe) + 'px';
    }
/*
    //画面端でとまる
    const frameMargin = 30;
    if (parseInt(viewImg.style.marginTop) > (frameMargin * -1)) {
        viewImg.style.marginTop = '0px';
    } else if (parseInt(viewImg.style.marginTop) < (screen.height - viewImg.clientHeight)) {
        viewImg.style.marginTop = (screen.height - viewImg.clientHeight) + 'px';
    }
    if (parseInt(viewImg.style.marginLeft) > 0) {
        viewImg.style.marginLeft = '0px';
    } else if (parseInt(viewImg.style.marginLeft) < (screen.width - viewImg.clientWidth)) {
        viewImg.style.marginLeft = (screen.width - viewImg.clientWidth) + 'px';
    }
    */
}
