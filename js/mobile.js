function detectMob() {
    const toMatch = [
        /Android/i,
        /webOS/i,
        /iPhone/i,
        /iPad/i,
        /iPod/i,
        /BlackBerry/i,
        /Windows Phone/i
    ];

    return toMatch.some((toMatchItem) => {
        return navigator.userAgent.match(toMatchItem);
    });
} 

if (detectMob()) {
    $("#prompt").html('tap in the <span class=highlighted">play area</span> to begin playing')
    $("#clicksContainer").html('<p><span class="number" id="clicks">0</span><br>taps</p>')
    $("#cpsContainer").html('<p><span class="number" id="cps">0.0</span></p><p>taps/second</p>')
    $("#secondsContainer").html('<p><span class="number" id="seconds">0.0</span><br>seconds</p>')
}