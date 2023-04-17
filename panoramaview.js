/*
panorama view
2023 kasumi
MIT licence

*/
var urls = ['sample.png'];
var viewPosition = 0;
const moveCoe = 1;
document.addEventListener("DOMContentLoaded", function (event) {
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
                        window.addEventListener('devicemotion', e => {
                            // devicemotionのイベント処理
                            deviceMotion(e);
                        })
                    } else {
                        // 許可を得られなかった場合の処理
                    }
                })
                .catch(console.error) // https通信でない場合などで許可を取得できなかった場合
        } else {
            // 上記以外のブラウザ
        }
    }
    function deviceMotion(event) {
        const cStyle = window.getComputedStyle(viewImg);
        //move.innerText = event.acceleration.x + "/" + event.acceleration.y;

        let angle = screen && screen.orientation && screen.orientation.angle;
        if (angle === undefined) {
            angle = window.orientation;    // iOS用
        }
        let nowCoe = (moveCoe * (document.body.clientWidth / window.innerWidth)) * 0.25;
        if (angle == 0 || angle == 180) {
            viewImg.style.marginLeft = parseInt(cStyle.marginLeft) + parseInt((event.rotationRate.beta) * nowCoe) + 'px';
            viewImg.style.marginTop = parseInt(cStyle.marginTop) + parseInt((event.rotationRate.alpha) * nowCoe) + 'px';
        } else {
            viewImg.style.marginLeft = parseInt(cStyle.marginLeft) + ((event.rotationRate.alpha) * nowCoe) + 'px';
            viewImg.style.marginTop = parseInt(cStyle.marginTop) - ((event.rotationRate.beta) * nowCoe) + 'px';
        }
    }
    var viewImg = document.getElementById("viewImg");
    viewImg.style.rotate = '0deg';
    hideAddressBar();
    window.addEventListener("orientationchange", hideAddressBar);
    window.addEventListener("devicemotion", function (event) {
        deviceMotion(event);
    });

    viewImg.src = urls[viewPosition];
    adjustSize(viewImg);

    document.getElementById("selmulti").addEventListener('change', function (event) {
        viewPosition = urls.length;
        for (var i = 0; i < event.target.files.length; i++) {
            urls.push(window.URL.createObjectURL(event.target.files[i]));
        }

        viewImg.src = urls[viewPosition];
        adjustSize(viewImg);
    });
    document.getElementById("home").addEventListener('click', function (event) {
        adjustSize(viewImg);
    });
    document.getElementById("useIphone").addEventListener('click', function (event) {
        requestDeviceMotionPermission();
    });
    document.getElementById("next").addEventListener('click', function (event) {
        if (viewPosition < (urls.length - 1)) {
            viewPosition++;
        }
        viewImg.src = urls[viewPosition];
        adjustSize(viewImg);
    });
    document.getElementById("prev").addEventListener('click', function (event) {
        if (viewPosition > 0) {
            viewPosition--;
        }
        viewImg.src = urls[viewPosition];
        adjustSize(viewImg);
    });
});

function adjustSize(img) {

    if (img.naturalWidth > img.naturalHeight) {
        img.style.width = (img.naturalWidth / img.naturalHeight) * 300 + '%';
    } else {
        img.style.width = '200%';
    }
    viewImg.style.marginLeft = ((img.clientWidth - screen.width) / 2) * -1 + 'px';
    viewImg.style.marginTop = ((img.clientHeight - screen.height) / 2) * -1 + 'px';

}


function hideAddressBar() {
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

