/*
panorama view
2023 kasumi
MIT licence

*/
const moveCoe = 1;
var buttonsOut;
var isiPhoneFirst = true;
document.addEventListener("DOMContentLoaded", function (event) {

    var urls = ['sample.png'];
    for (let i = 0; i < urls.length; i++) {
        var div = document.createElement("div");
        var el = document.createElement("img");
        div.appendChild(el);
        el.src = urls[i]
        setImgEvent(el);
        document.getElementById('views').insertBefore(div, document.querySelector("#views>button"));
    }

    if (!isiPhone()) {
        window.addEventListener("devicemotion", function (event) {
            if (document.querySelector('#views div.viewImg') != null) {
                deviceMotion(event);
            }
        });
        isiPhoneFirst = false;
    }

    var buttonsOut;

    document.getElementById("file").addEventListener('click', function (event) {
        document.getElementById("selmulti").click();
    });
    document.getElementById("selmulti").addEventListener('change', function (event) {
        for (var i = 0; i < event.target.files.length; i++) {
            var div = document.createElement("div");
            var el = document.createElement("img");
            el.src = window.URL.createObjectURL(event.target.files[i]);
            div.appendChild(el);
            setImgEvent(el);
            document.getElementById('views').insertBefore(div, document.querySelector("#views>button"));
        }
    });
    document.getElementById("next").addEventListener('click', function (event) {
        let nextImg = document.querySelector('#views div.viewImg+div img');
        document.getElementById("exit").click();
        nextImg.click();
        buttonResetFadeout();
    });
    document.getElementById("prev").addEventListener('click', function (event) {
        let prevImg = document.querySelector('#views div.viewImg').previousElementSibling.firstElementChild;
        document.getElementById("exit").click();
        prevImg.click();
        buttonResetFadeout();
    });
    document.getElementById("delete").addEventListener('click', function (event) {
        document.querySelector('#views div.viewImg').remove();
        document.getElementById("exit").click();
    });

    document.getElementById("exit").addEventListener('click', function (event) {
        const viewDiv = document.querySelector("div.viewImg");
        const img = document.querySelector("div.viewImg img");
        viewDiv.classList.remove('viewImg');
        document.querySelector("div.buttons").classList.add('hidden');
        img.style.width = null;
        img.style.marginTop = null;
        img.style.marginLeft = null;
        img.style.translate = null;
        if (document.fullscreenElement !== null) {
            document.exitFullscreen();
        }
    });


});

function setImgEvent(img) {
    img.addEventListener('click', function (event) {
        if (img.parentElement.classList.contains('viewImg')) {
            buttonResetFadeout();
        } else {
            if (isiPhoneFirst) {
                requestDeviceMotionPermission(img);
            } else {
                viewMotion(img);
            }
            navChange();
        }
    });
}


function viewMotion(img) {
    if (isSmartPhone() & !isiPhone()) {
        //document.documentElement.requestFullscreen();
    }
    img.parentElement.classList.add('viewImg');
    buttonResetFadeout();
    adjustSize(img);
}

function adjustSize(img) {
    var mWidth = screen.width;
    let angle = screen && screen.orientation && screen.orientation.angle;
    if (angle === undefined) {
        angle = window.orientation;    // iOS用
    }

    if (angle == 0) {
        mWidth = screen.height;
    }

    if (img.naturalWidth > img.naturalHeight) {
        img.style.width = mWidth * (img.naturalWidth / img.naturalHeight) * 3 + 'px';
    } else {
        img.style.width = mWidth * 2 + 'px';
    }

    if (angle == 0) {
        img.style.translate = img.clientHeight + 'px ' + '0px';
        img.style.marginTop = ((img.clientWidth - screen.height) / 2) * -1 + 'px';
        img.style.marginLeft = ((img.clientHeight - screen.width) / 2) * -1 + 'px';
    } else {
        img.style.marginLeft = ((img.clientWidth - screen.width) / 2) * -1 + 'px';
        img.style.marginTop = ((img.clientHeight - screen.height) / 2) * -1 + 'px';

    }
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
const requestDeviceMotionPermission = (img) => {
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
                    window.addEventListener('devicemotion', e => {
                        // devicemotionのイベント処理
                        if (document.querySelector('#views img.viewImg') != null) {
                            deviceMotion(e);
                        }
                    })
                    viewMotion(img);
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
    if (document.querySelector('#views div.viewImg+div img') == null) {
        document.getElementById("next").classList.add('hidden');
    } else {
        document.getElementById("next").classList.remove('hidden');
    }
    if (document.querySelector('#views div.viewImg').previousElementSibling == null) {
        document.getElementById("prev").classList.add('hidden');

    } else if (document.querySelector('#views div.viewImg').previousElementSibling.firstElementChild == null) {
        document.getElementById("prev").classList.add('hidden');
    } else {
        document.getElementById("prev").classList.remove('hidden');
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
    const viewImg = document.querySelector('#views div.viewImg img');
    const cStyle = window.getComputedStyle(viewImg);
    //move.innerText = event.acceleration.x + "/" + event.acceleration.y;

    let angle = screen && screen.orientation && screen.orientation.angle;
    if (angle === undefined) {
        angle = window.orientation;    // iOS用
    }

    let nowCoe = (moveCoe * (document.body.clientWidth / window.innerWidth)) * 0.3;
    const frameMargin = 30;
    //let nowCoe = 5;
    if (angle == 0 || angle == 180) {
        viewImg.style.marginLeft = parseInt(cStyle.marginLeft) + parseInt((event.rotationRate.beta) * nowCoe) + 'px';
        viewImg.style.marginTop = parseInt(cStyle.marginTop) + parseInt((event.rotationRate.alpha) * nowCoe) + 'px';

        //画面端でとまる
        if (parseInt(viewImg.style.marginTop) > frameMargin) {
            viewImg.style.marginTop = frameMargin + 'px';
        } else if (parseInt(viewImg.style.marginTop) < (screen.height - viewImg.clientWidth - frameMargin)) {
            viewImg.style.marginTop = (screen.height - viewImg.clientWidth - frameMargin) + 'px';
        }
        if (parseInt(viewImg.style.marginLeft) > frameMargin) {
            viewImg.style.marginLeft = frameMargin + 'px';
        } else if (parseInt(viewImg.style.marginLeft) < (screen.width - viewImg.clientHeight - frameMargin)) {
            viewImg.style.marginLeft = (screen.width - viewImg.clientHeight - frameMargin) + 'px';
        }

    } else {
        viewImg.style.marginLeft = parseInt(cStyle.marginLeft) + ((event.rotationRate.alpha) * nowCoe) + 'px';
        viewImg.style.marginTop = parseInt(cStyle.marginTop) - ((event.rotationRate.beta) * nowCoe) + 'px';
    }
}
