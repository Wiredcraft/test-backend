class GlobalSummary extends VueComponent {
    setup () {
        const overall = Vue.reactive([]);
        const finish = Vue.ref();

        (async () => overall.push(...await $memo(':overview')))()
        
    
        setTimeout(() => {
            finish.value = ''
        }, 4200)
        return { overall, finish }
    }
    app () {
        return this.$('ul')
    }
}
window.customElements.define('global-summary', GlobalSummary);
export default GlobalSummary;

