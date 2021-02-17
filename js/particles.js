function createParticle(x, y, big) {
    if (!document.body.animate) return
    if (detectMob()) return

    const particle = document.createElement('particle')

    document.getElementById("playArea").appendChild(particle)

    let size = 7
    let duration = 250

    if (big) {
        size = 13
        duration = 500
    }

    particle.style.width = `${size}px`
    particle.style.height = `${size}px`

    particle.style.background = `#141923`;

    const headerHeight = $("header").height()

    y = y - headerHeight

    const destinationX = x + (Math.random() - 0.5) * 2 * 125;
    const destinationY = y + (Math.random() - 0.5) * 2 * 125;

    const animation = particle.animate([
        {
            transform: `translate(${x - (size / 2)}px, ${y - (size / 2)}px)`,
            opacity: 1
        },
        {
            transform: `translate(${destinationX}px, ${destinationY}px)`,
            opacity: 0
        }
    ], {
        duration: duration + Math.random() * 1000,
        easing: 'cubic-bezier(0, .9, .57, 1)',
    })

    animation.onfinish = () => {
        particle.remove();
    }
}