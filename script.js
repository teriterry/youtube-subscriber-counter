// script.js
import { RollingCounter } from './js/rolling-counter.js';

const subsCounter = new RollingCounter('#subscriberCount', 0);
window.subsCounter = subsCounter;

const CLIENT_ID = '447703056009-5u9n18137gdlknbd5ds1rhr4h6rt4ifs.apps.googleusercontent.com';
const REDIRECT_URI = window.location.href.split('#')[0];
const REFRESH_INTERVAL = 5000;

function getAccessTokenFromUrl() {
    const hashParams = new URLSearchParams(window.location.hash.substr(1));
    return hashParams.get('access_token');
}

let enableTargetCheck = false;

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
        if (count >= targetCount && enableTargetCheck) {

        } else {

        }

    } catch (err) {
        console.error("⚠️ エラー:", err);
        $('#subscriberCount').text('エラーが発生しました。');
    }
}

let targetCount = 400000;
let currentSubscriberCount = 0;

$(document).ready(function () {
    const token = getAccessTokenFromUrl();
    $('.target-container').hide();
    $('.div2').hide();
    $('.div15').hide();
    $('.div16').hide();
    $('.div19').hide();

    $(".div11").hide();
    $(".div12").hide();

    $('.btnTarget').on('click', function () {
        const userInput = parseInt($('#myNumber').val(), 10);
        if (!isNaN(userInput) && userInput > 0) {
            targetCount = userInput;
            $('#targetDisplay').text(targetCount);

            if (currentSubscriberCount >= targetCount && enableTargetCheck) {
                // $('.target-container').fadeIn(300);
                $('.div2').fadeIn(300);
                $('.div11').css({
                    'background-image': 'url("./img/img2/body2.png")',
                    'animation': '2s bounce ease-in-out infinite'
                }).show();
                $('.div12').hide();
                $('.div15').show();
                $('.div16').show();
                $('.div19').show();
            } else {
                // $('.target-container').fadeOut(300);
                $('.div2').fadeOut(300);
                $('.div11').css({
                    'background-image': 'url("./img/img2/body1.png")',
                    'animation': '2s headShake linear infinite'
                }).show();
                $('.div12').show();
                $('.div15').hide();
                $('.div16').hide();
                $('.div19').hide();
            }
        }
    });

    /* Checkbox Toggle Event */
    $('#toggleTarget').on('change', function () {
        if ($(this).is(':checked')) {
            enableTargetCheck = true;

            $('.target-container').fadeIn(300);
            $('.div11').css({
                'background-image': 'url("./img/img2/body1.png")',
                'animation': '2s headShake linear infinite'
            }).show();
            $('.div12').show();
        } else {
            enableTargetCheck = false;

            $('.target-container').fadeOut();
            $('.div2').hide();
            // $('.div11').css({
            //     'background-image': 'url("./img/img2/body1.png")',
            //     'animation': '2s headShake linear infinite'
            // });
            // $('.div12').show();
            $(".div11").hide();
            $(".div12").hide();

            $('.div15').hide();
            $('.div16').hide();
            $('.div19').hide();
        }
    });

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

        // $("#loginBtn").hide();
        // $('.target-settings').show();
        // $('.stats-container').show();

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
