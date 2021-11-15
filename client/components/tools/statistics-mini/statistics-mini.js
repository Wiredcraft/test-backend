class StatisticsMini extends VueToolComponent {
    // Maybe draw Linear!! 曲线!
    setup () {
        const statistics = Vue.reactive([{    // todo: Load from server
            title: '销售总额', // '签到人数',
            total: (49295).toPrice(),
            data: [78, 22, 31, 12, 56, 67, 20],
            color: '#68bca1'
        }, {
            title: '本月营销', // '　营业额',
            total: (12898).toPrice(),
            data: [78, 22, 31, 12, 56, 67, 70],
            color: '#3384b4'
        }, {
            title: '新增客户',
            total: '89',
            data: [78, 22, 31, 12, 56, 120, 50],
            color: '#f06c4b'
        }])
        const canvasList = []
        

        Vue.nextTick(async () => {
//             console.log('Next tick')
//             console.dir(canvasList)
            // await sleep(100)   // required
            for (let i = 0; i < canvasList.length; i++) {
                const canvas = canvasList[i]
                const { screenRect: { width, height } } = canvas
                canvas.width = width * DPR
                canvas.height = height * DPR

                const ctx = canvas.getContext('2d')
                const { data, color } = statistics[i]
                const columnWidth = canvas.width / data.length
                const fillWidth = columnWidth * 0.75
                const max = Math.max(...data)
                
                ctx.fillStyle = color
                Progress.watch(ratio => {
                    data.forEach((value, n) => {
                        const height = value / max * canvas.height * ratio
                        ctx.fillRect(n * columnWidth, canvas.height - height - 0 * DPR, fillWidth, height)
                    })
                }, {
                    // delay: 100,
                    duration: 1.4
                })
                
            }
        })
        return { 
            statistics, 
            push: (el) => canvasList.push(el)
        }
    }
}
window.customElements.define('statistics-mini', StatisticsMini);
export default StatisticsMini;

