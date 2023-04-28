/*
panorama view
2023 kasumi
MIT licence

*/
const moveCoe = 1;
var buttonsOut;
var isiPhoneFirst = true;
var touchX;
var touchY;
var touchDist;
document.addEventListener("DOMContentLoaded", function (event) {

    var urls = ['sample.png', 'sample2.jpg'];
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
        exitImg();
        nextImg.click();
        buttonResetFadeout();
    });
    document.getElementById("prev").addEventListener('click', function (event) {
        let prevImg = document.querySelector('#views div.viewImg').previousElementSibling.firstElementChild;
        exitImg();
        prevImg.click();
        buttonResetFadeout();
    });
    document.getElementById("delete").addEventListener('click', function (event) {
        document.querySelector('#views div.viewImg').remove();
        document.getElementById("exit").click();
    });

    document.getElementById("exit").addEventListener('click', function (event) {

        exitImg();
        if (document.fullscreenElement !== null) {
            document.exitFullscreen();
        }
    });
    document.querySelector("div.buttons").addEventListener('transitionend', function (event) {
        if (event.target.classList.contains('fadeout')) {
            event.target.classList.add('hidden');
        }
    });


});

function exitImg() {
    const viewDiv = document.querySelector("div.viewImg");
    const img = document.querySelector("div.viewImg img");
    viewDiv.classList.remove('viewImg');
    document.querySelector("div.buttons").classList.add('hidden');
    img.style.width = null;
    img.style.height = null;
    img.style.marginTop = null;
    img.style.marginLeft = null;
    img.style.translate = null;
}

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

    ['mousedown', 'touchstart'].forEach(function (item) {
        img.addEventListener(item, function (e) {
            //e.preventDefault();
            if (e.type === "mousedown") {
                var event = e;
            } else {
                var event = e.touches[0];
            }
            if (event.target.parentElement.classList.contains('viewImg')) {
                touchX = event.screenX;
                touchY = event.screenY;
                if (e.touches.length >= 2) {
                    const p1 = e.touches[0];
                    const p2 = e.touches[1];
                    touchDist = getDist(p2, p1);

                } else {
                    //touchDist = null;
                }
                event.target.classList.add('drag');
            }
        })
    });

    ['mouseup', 'mouseleave', 'touchend', 'touchleave'].forEach(function (item) {
        img.addEventListener(item, function (e) {
            let drag = document.querySelector('.drag')
            if (drag != null) {
                drag.classList.remove('drag');
                touchDist = null;
            }
        })
    });

    ['mousemove', 'touchmove'].forEach(function (item) {
        img.addEventListener(item, function (e) {
            e.preventDefault();
            if (e.type === "mousemove") {
                var event = e;
            } else {
                var event = e.touches[0];
            }
            if (event.target.parentElement.classList.contains('viewImg')) {
                if (event.target.classList.contains('drag')) {
                    const img = event.target;
                    if (e.touches.length >= 2) {
                        if (touchDist != null) {
                            const p1 = e.touches[0];
                            const p2 = e.touches[1];
                            const scale = getDist(p2, p1) / touchDist;
                            if (img.naturalWidth > img.naturalHeight) {
                                img.style.height = img.clientHeight * scale + 'px';
                                let wHeight = screen.height;
                                if (getDevideAngle() == 0) {
                                    wHeight = screen.width;
                                }
                                if (parseFloat(img.style.height) < wHeight) {
                                    img.style.height = wHeight + 'px';
                                } else if (parseFloat(img.style.height) > (wHeight * 10)) {
                                    img.style.height = wHeight * 10 + 'px';
                                }
                                if (getDevideAngle() == 0) {
                                    img.style.translate = img.clientHeight + 'px ' + '0px';
                                }

                            } else {
                                img.style.width = img.clientHeight * scale + 'px';
                                let wWidth = screen.width;
                                if (getDevideAngle() == 0) {
                                    wWidth = screen.height;
                                }
                                if (parseFloat(img.style.width) < wWidth) {
                                    img.style.width = wWidth + 'px';
                                } else if (parseFloat(img.style.width) > (wWidth * 10)) {
                                    img.style.width = wWidth * 10 + 'px';
                                }
                            }
                        }
                        touchDist = getDist(p2, p1);
                    } else {
                        const cStyle = window.getComputedStyle(img);
                        img.style.marginLeft = parseFloat(cStyle.marginLeft) + (event.screenX - touchX) + 'px';
                        img.style.marginTop = parseFloat(cStyle.marginTop) + (event.screenY - touchY) + 'px';
                        touchX = event.screenX;
                        touchY = event.screenY;
                    }
                }
            }
        });
    })

}


function getDist(p2, p1) {
    return Math.sqrt(Math.pow(p2.pageX - p1.pageX, 2) + Math.pow(p2.pageY - p1.pageY, 2));
}

function viewMotion(img) {
    if (document.fullscreenElement === null) {
        if (!location.href.startsWith('file')) {
            document.documentElement.requestFullscreen();
        }
    }
    img.parentElement.classList.add('viewImg');
    buttonResetFadeout();
    ajustSize(img);
}

function ajustSize(img) {
    let angle = getDevideAngle();

    if (img.naturalWidth > img.naturalHeight) {
        if (angle == 0) {
            img.style.height = screen.width * 2 + 'px';
        } else {
            img.style.height = screen.height * 2 + 'px';
        }
        img.style.width = "auto";
    } else {
        if (angle == 0) {
            img.style.width = screen.height * 2 + 'px';
        } else {
            img.style.width = screen.width * 2 + 'px';
        }
        img.style.height = "auto";
    }
    img.style.marginTop = '0'
    if (angle == 0) {
        img.style.translate = img.clientHeight + 'px ' + '0px';
        img.style.marginTop = parseInt((img.clientWidth - screen.height) / 2) * -1 + 'px';
        img.style.marginLeft = parseInt((img.clientHeight - screen.width) / 2) * -1 + 'px';
    } else {
        img.style.marginLeft = parseInt((img.clientWidth - screen.width) / 2) * -1 + 'px';
        img.style.marginTop = parseInt((img.clientHeight - screen.height) / 2) * -1 + 'px';

    }
}

function getDevideAngle() {
    let angle = screen && screen.orientation && screen.orientation.angle;
    if (angle === undefined) {
        angle = window.orientation; // iOS用
    }
    return angle;
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
                    window.addEventListener('devicemotion', event => {
                        // devicemotionのイベント処理
                        if (document.querySelector('#views div.viewImg') != null) {
                            deviceMotion(event);
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
    if (!viewImg.classList.contains('drag')) {
        const cStyle = window.getComputedStyle(viewImg);
        //move.innerText = event.acceleration.x + "/" + event.acceleration.y;

        let nowCoe = (moveCoe * (document.body.clientWidth / window.innerWidth)) * 0.3;
        const frameMargin = 30;
        //let nowCoe = 5;
        if (getDevideAngle() == 0) {
            viewImg.style.marginLeft = parseFloat(cStyle.marginLeft) + ((event.rotationRate.beta) * nowCoe) + 'px';
            viewImg.style.marginTop = parseFloat(cStyle.marginTop) + ((event.rotationRate.alpha) * nowCoe) + 'px';

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
            viewImg.style.marginLeft = parseFloat(cStyle.marginLeft) + ((event.rotationRate.alpha) * nowCoe) + 'px';
            viewImg.style.marginTop = parseFloat(cStyle.marginTop) - ((event.rotationRate.beta) * nowCoe) + 'px';

            //画面端でとまる
            if (parseInt(viewImg.style.marginTop) > frameMargin) {
                viewImg.style.marginTop = frameMargin + 'px';
            } else if (parseInt(viewImg.style.marginTop) < (screen.height - viewImg.clientHeight - frameMargin)) {
                viewImg.style.marginTop = (screen.height - viewImg.clientHeight - frameMargin) + 'px';
            }
            if (parseInt(viewImg.style.marginLeft) > frameMargin) {
                viewImg.style.marginLeft = frameMargin + 'px';
            } else if (parseInt(viewImg.style.marginLeft) < (screen.width - viewImg.clientWidth - frameMargin)) {
                viewImg.style.marginLeft = (screen.width - viewImg.clientWidth - frameMargin) + 'px';
            }

        }
    }
}
