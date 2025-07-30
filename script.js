// script.js
import { RollingCounter } from './js/rolling-counter.js';

const subsCounter = new RollingCounter('#subscriberCount', 0);
window.subsCounter = subsCounter;

const CLIENT_ID = '447703056009-5u9n18137gdlknbd5ds1rhr4h6rt4ifs.apps.googleusercontent.com';
const REDIRECT_URI = window.location.href.split('#')[0];
const REFRESH_INTERVAL = 15000;

function getAccessTokenFromUrl() {
    const hashParams = new URLSearchParams(window.location.hash.substr(1));
    return hashParams.get('access_token');
}

async function getSubscriberCount(token) {
    try {
        const response = await fetch('https://www.googleapis.com/youtube/v3/channels?part=statistics&mine=true', {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });

        const data = await response.json();

        if (!response.ok || !data.items || data.items.length === 0) {
            $('#subscriberCount').text('登録者数を取得できませんでした。再度ログインしてください。');
            return;
        }

        const count = data.items[0].statistics.subscriberCount;
        currentSubscriberCount = count;
        subsCounter.update(`${count}`);
        // console.log(`登録者数：${count}`);

        // 🎯 目標達成チェック
        if (count >= targetCount) {
            // $('.div2').fadeIn(300).addClass('show');
            $('.div1').addClass('bounce-animation');
            $('.div3').fadeIn(300).addClass('show');

        } else {
            $('.div1').removeClass('bounce-animation');
            $('.div3').hide().removeClass('show');
        }


    } catch (err) {
        console.error("⚠️ エラー:", err);
        $('#subscriberCount').text('エラーが発生しました。');
    }
}

let targetCount = 400000;
let currentSubscriberCount = 0;

$('.btnTarget').on('click', function () {
    const userInput = parseInt($('#myNumber').val(), 10);
    if (!isNaN(userInput) && userInput > 0) {
        targetCount = userInput;
        $('#targetDisplay').text(targetCount);
        // $('.div2').removeClass('show').hide(); // 再設定時に隠す

        if (currentSubscriberCount >= targetCount) {
            $('.div1').addClass('bounce-animation');
            $('.div3').fadeIn(300).addClass('show');
        } else {
            $('.div1').removeClass('bounce-animation');
            $('.div3').hide().removeClass('show');
        }
    }
});


$(document).ready(function () {
    const token = getAccessTokenFromUrl();

    $('.div1').removeClass('bounce-animation');
    $('.div2').hide().removeClass('show');
    $('.div3').hide().removeClass('show');

    if (token) {
        $('#loginBtn').hide();
        $('.target-settings').show();
        $('.stats-container').show();
        getSubscriberCount(token);
        setInterval(() => getSubscriberCount(token), REFRESH_INTERVAL);

    } else {
        $('#loginBtn').show();
        $('.target-settings').hide();
        $('.stats-container').hide();

        console.log("Token Null")
    }

    $('#loginBtn').on('click', function () {
        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
            `client_id=${CLIENT_ID}&` +
            `redirect_uri=${encodeURIComponent(REDIRECT_URI)}&` +
            `response_type=token&` +
            `scope=https://www.googleapis.com/auth/youtube.readonly&` +
            `include_granted_scopes=true`;

        window.location.href = authUrl;
    });
});
