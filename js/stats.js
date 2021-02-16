const stats = class {
    /**
     * @returns {stats}
     * @param {Number} clicks 
     * @param {Number} games 
     * @param {Number} highest 
     * @param {Date} expire 
     */
    constructor(clicks, games, highest, expire) {
        this.clicks = parseInt(clicks)
        this.games = parseInt(games)
        this.highest = parseInt(highest)
        
        if (!expire) {
            const date = new Date()
            this.expire = date.setDate(date.getDate() + 30)
        }

        return this
    }

    /**
     * @returns {String}
     */
    saveCookie() {
        const cookie = `stats=${this.clicks} ${this.games} ${this.highest}; expires=${new Date(this.expire).toUTCString()}; path=/`
        document.cookie = cookie
        return cookie
    }

    /**
     * @returns {Number}
     * @param {Number} amount 
     */
    addClicks(amount) {
        this.clicks += amount

        return this.clicks
    }

    /**
     * @returns {Number}
     */
    addGame() {
        this.games++

        return this.games
    }

    /**
     * @returns {Number}
     * @param {Number} newHighest 
     */
    setHighest(newHighest) {
        this.highest = newHighest

        return this.highest
    }


    static fromCookie(cookie) {
        cookie = cookie.split(" ")
        
        const clicks = cookie[0].split("=")[1]
        const games = cookie[1]
        const highest = cookie[2]

        return new stats(clicks, games, highest)
    }
}