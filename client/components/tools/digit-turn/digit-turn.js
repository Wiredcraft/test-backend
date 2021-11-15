class DigitTurn extends ToolComponent {

    async build () {
        const canvas = this.$('canvas')
        await waitFrame(5)
        const { width, height } = canvas.screenRect 
        canvas.width = width * DPR
        canvas.height = height * DPR
        const ctx = canvas.getContext('2d')
        ctx.font = `400 ${canvas.height}px ${this.computedStyles['font-family']}`
        ctx.fillStyle = canvas.computedStyles.color

        let charWidth = 0
        for (let n = 0; n <= 9; n++) {
            charWidth = Math.max(charWidth, ctx.measureText(n).width)
        }
        const sum = Number.parseInt(this.innerHTML)
        const negative = sum < 0
        const kLineHeight = 0.9
        const digits = Math.abs(sum).toString().split('').map(Number.parseInt.unary)
        const calcus = []
        for (let x = 0; x < digits.length; x++) {
            calcus[x] = digits[x] + (x > 0 ? calcus[x - 1] * 10 : 0)
        }
        // todo: digits < 0 / negative number
        const draw = rate => {            
            canvas.clear()
            // todo Write the function to write a number, which maybe decimal but draw only integr, with the offset
            if (negative) {
                ctx.save()
                ctx.globalAlpha = rate
                ctx.fillText('-', 0, canvas.height * kLineHeight**2)
                ctx.restore()
            }
            for (let i = 0; i < digits.length; i++) {
                const unitValue = calcus[i] * rate
                const value = unitValue % 10
                const digit1 = Math.floor(value)
                const digit2 = (digit1 + 1) % 10
                const x = (i + (negative ? 1 : 0)) * charWidth
                const y1 = canvas.height * (-(value % 1) + kLineHeight)
               
                const y2 = y1 + canvas.height
                if (unitValue >= 1 || sum === 0) {
                    ctx.fillText(digit1, x, y1)
                }
                ctx.fillText(digit2, x, y2)                

            }
        }
        const inter = 0.95 // sum === 0 ? 0 : ((sum - 5) / sum) // 0.97
        const delay = Number.parseInt(this.attr('delay')) ?? 0
        Progress.watch(draw, {
            to: inter,
            duration: 0.5,
            speed: 'ease-in',
            delay,
            done () {
                Progress.watch(draw, {
                    duration: 0.7, // + (delay / 2000),
                    from: inter,
                    speed: 'ease-out',
                })
            }
        })
    }
}
window.customElements.define('digit-turn', DigitTurn);
export default DigitTurn;

