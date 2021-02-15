let mode = 5
let state = 0
let clicks = 0
let seconds = 0

function changeMode(modeSelected) {
    if (state != 0) return
    if (modeSelected == mode) return

    mode = modeSelected

    document.getElementsByClassName("selected")[0].classList.remove("selected")
    document.getElementById(modeSelected).classList.add("selected")
}

$("#playArea").unbind().click(() => {
    if (state == 0) {
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

function calculateCps() {
    if (seconds < 10) {
        return (clicks / 1).toFixed(1)
    }
    return (clicks / (seconds / 10)).toFixed(1)
}