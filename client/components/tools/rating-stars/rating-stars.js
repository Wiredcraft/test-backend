class RatingStars extends ToolComponent {
     static get observedAttributes() { 
        return ['ratings'] 
    }
    build () {
        this.draw()
    } 
    attributeChangedCallback(name, oldValue, ratings) {
        this.ratings = JSON.parse(ratings)
        this.draw()
    }
    draw () {
        if (this.container && this.ratings) {
            const { ratings } = this
            const avg = (ratings.map(({ count, rating }) => count * rating).reduce((a, b) => a + b, 0) / (ratings.reduce((a, b) => a + b.count, 0)))
            const totalCount = ratings.reduce((a, b) => a + b.count, 0)

            const stars = []
            const rates = []

            for (let i = 1; i <= 5; i++) {
                if (avg >= i - 1/3 || totalCount === 0) {
                    stars.push('star')
                } else if (avg >= i - 2/3) {
                    stars.push('star-half')
                } else {
                    stars.push('star-outline')
                }
                const { count } = ratings.find(({ rating }) => rating === i) ?? { count : 0 }, ratio = Math.round(count / totalCount * 1000)/10 + '%'
                rates.push(html`<div><span>${i}星</span><ratio style="--width: ${ratio}"></ratio> <span>${ratio}<span></div>`)
            }
            const scoresHTML = rates.join('\n')
            this.$('stars').innerHTML = stars.map(icon => html`<svg-icon icon="${icon}"></svg-icon>`).join('')
            if (totalCount) {
                this.$('scores').innerHTML = html`${scoresHTML}<h4>共 <strong>${totalCount}</strong> 评星 平均 <strong>${avg.toFixed(2).floatValue}</strong> 星</h4>`
            } else {
                this.$('stars').addClass('empty')
            }
        }
    }

}
window.customElements.define('rating-stars', RatingStars)
export default RatingStars

