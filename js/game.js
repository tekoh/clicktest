let mode = 5
let state = 0
let clicks = 0
let seconds = 0

let data
let autosave = false

function changeMode(modeSelected) {
    if (state != 0 && state != 5) return
    if (modeSelected == mode) return

    mode = modeSelected

    $(".selected").removeClass("selected")
    $(`#${modeSelected}`).addClass("selected")
}

$("#playArea").unbind().click(() => {
    if (state == 0 || state == 5) {
        state = 1

        startTime = new Date().getTime()

        updateClicks(clicks + 1)

        const secondsUpdater = setInterval(() => {
            seconds = seconds + 1

            $("#seconds").text((seconds / 10).toFixed(1))
            updateCps()

            if ((seconds / 10) == mode) {
                clearInterval(secondsUpdater)
                state = 3

                $("#clicksResult").text(clicks)
                $("#cpsResult").text(calculateCps())
                $("#secondsResult").text((seconds / 10))
                
                openFullscreen()
                openResults()

                setTimeout(() => {
                    state = 4

                    const cps = parseInt(calculateCps() * 10)
                    
                    if (data instanceof stats) {
                        data.addClicks(clicks)
                        data.addGame()

                        if (cps > data.highest) {
                            data.setHighest(cps)
                        }

                        if (autosave) {
                            data.saveCookie()
                        }

                        updateStats()
                    } else {
                        data = new stats(clicks, 1, cps)

                        updateStats()
                    }
                }, 1000)
            }
        }, 100);

        $("#playArea h1").css("opacity", "0%")
        setTimeout(() => {
            $("#playArea h1").css("display", "none")
            $("#playArea").css("outline", "5px dotted rgb(120, 203, 241, 0)")
        }, 150)
    } else if (state == 1) {
        updateClicks(clicks + 1)
        updateCps()
    }
})

function updateClicks(value) {
    clicks = value
    $("#clicks").text(value)
}

function updateCps() {
    const cps = calculateCps()
    $("#cps").text(cps)
}

/**
 * @returns {String}
 */
function calculateCps() {
    if (seconds < 10) {
        return (clicks / 1).toFixed(1)
    }
    return (clicks / (seconds / 10)).toFixed(1)
}

function saveResults() {
    if (state == 3) return

    closeResults()
    openCookies()
}

function deleteCookie() {
    data = null
    document.cookie = "stats=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
    autosave = false

    $("#lowerResults").css("display", "flex")
    $("#lowerResultsBig").css("display", "none")
}

function restartGame() {
    if (state == 3) return

    closeFullscreen()
    closeResults()
    
    $("#playArea").css("outline", "5px dotted rgb(120, 203, 241)")


    state = 5
    seconds = 0

    $("#seconds").text("0.0")
    $("#cps").text("0.0")
    
    updateClicks(0)
}

function updateStats() {
    $("#statsTotalClicks").text(data.clicks)
    $("#statsTotalGames").text(data.games)
    $("#statsHighest").text(data.highest / 10)
}

function openFullscreen() {
    $("#fullscreen").addClass("fadeIn")
    $("#fullscreen").css("display", "block")
    setTimeout(() => {
        $("#fullscreen").removeClass("fadeIn")
    }, 1000);
}

function closeFullscreen() {
    $("#fullscreen").addClass("fadeOut")
    setTimeout(() => {
        $("#fullscreen").css("display", "none")
        $("#fullscreen").removeClass("fadeOut")
    }, 1000);
}

function openResults() {
    $("#results").addClass("slideIn")
    $("#results").css("display", "block")
    setTimeout(() => {
        $("#results").removeClass("slideIn")
    }, 500);
}

function closeResults() {
    $("#results").addClass("slideOut")
    setTimeout(() => {
        $("#results").css("display", "none")
        $("#results").removeClass("slideOut")
    }, 1000);
}

function openCookies() {
    $("#cookieConsent").addClass("slideIn")
    $("#cookieConsent").css("display", "block")
    setTimeout(() => {
        $("#cookieConsent").removeClass("slideIn")
    }, 500);
}

function closeCookies() {
    $("#cookieConsent").addClass("slideOut")
    setTimeout(() => {
        $("#cookieConsent").css("display", "none")
        $("#cookieConsent").removeClass("slideOut")
    }, 1000);
}


if (document.cookie) {
    data = stats.fromCookie(document.cookie)
    autosave = true

    console.log("found cookie data for stats: ", data)

    $("#lowerResults").css("display", "none")
    $("#lowerResultsBig").css("display", "block")

    updateStats()
}