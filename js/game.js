let mode = 5
let state = 0
let clicks = 0
let seconds = 0
let lastClick, secondsUpdater

let data
let autosave = false

$("#playArea").unbind().click((e) => {

    if (state == 0 || state == 5) {
        state = 1

        startTime = new Date().getTime()

        updateClicks(clicks + 1)

        secondsUpdater = setInterval(() => {
            seconds = seconds + 1

            $("#seconds").text((seconds / 10).toFixed(1))
            updateCps()

            if ((seconds / 10) == mode) {
                endGame()
            }
        }, 100);

        $("#playArea h1").css("opacity", "0%")
        setTimeout(() => {
            $("#playArea h1").css("display", "none")
            $("#playArea").css("outline", "5px dotted rgb(120, 203, 241, 0)")
        }, 150)
    } else if (state == 1) {

        if (mode == 69420) {
            const now = new Date().getTime()

            if (lastClick && now - lastClick >= 1500) {
                clicks = 0
                seconds = 0
            }
            lastClick = now
        }

        updateClicks(clicks + 1)
        updateCps()

        const cps = calculateCps()
        if (cps > 5 && cps < 10) {
            createParticle(e.clientX, e.clientY)
        } else if (cps > 10) {
            createParticle(e.clientX, e.clientY, true)
        } 
    }
})

$("body").keyup((e) => {
    if (e.key.toLowerCase() == "escape") {
        if (state == 1) {
            endGame()
        }
    }
})

function endGame() {
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
        } else {
            data = new stats(clicks, 1, cps)
        }

        if ((seconds / 10) == mode) {
            updateStats()
        }
    }, 1000)
}

function changeMode(modeSelected) {
    if (state != 0 && state != 5) return
    if (modeSelected == mode) return

    mode = modeSelected

    $(".selected").removeClass("selected")
    $(`#${modeSelected}`).addClass("selected")
}

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

function cookieAccept() {
    autosave = true

    $("#lowerResults").css("display", "none")
    $("#lowerResultsBig").css("display", "block")

    closeCookies()
    showCheckmark()
    setTimeout(() => {
        closeCheckmark()
        restartGame()
    }, 2500)
}

function cookieDecline() {
    autosave = false

    closeCookies()
    restartGame()
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

function showCheckmark() {
    $("#tick").css("height", "15rem")
    $("#tick").css("width", "15rem")
    $("#tick").css("transform", "translate(-50%, 1000%)")
    $("#tick").addClass("checkMark")
    $("#tick").css("display", "block")
    $("#tick").css("transform", "translate(-50%, -50%)")
    setTimeout(() => {
        $("#tick").removeClass("checkMark")
    }, 2000)
}

function closeCheckmark() {
    $("#tick").addClass("slideOut")
    setTimeout(() => {
        $("#tick").css("height", "0px")
        $("#tick").css("width", "0px")
        $("#tick").css("transform", "translate(1000%, 1000%)")
        $("#tick").css("display", "none")
        $("#tick").removeClass("slideOut")
    }, 1000)
}

if (document.cookie) {
    data = stats.fromCookie(document.cookie)
    autosave = true

    console.log("found cookie data for stats: ", data)

    $("#lowerResults").css("display", "none")
    $("#lowerResultsBig").css("display", "block")

    setTimeout(() => {
        updateStats()
    }, 500);
}