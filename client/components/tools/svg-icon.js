const HTML = (svg) => {
    return html`<style>
    svg {
        --length: var(--width, 20px);
        width: var(--length);
        height: var(--length);
        fill: currentColor;
        stroke: currentColor;
        transition: var(--duration);
        display: block;
    }
    svg:hover {
        --color: var(--hover);
    }
    </style>
    ${svg}`
}

const kPrefix = '/src/svg'
window.customElements.define('svg-icon', class extends HTMLElement {
    constructor () {
        super()
        this.root = this.attachShadow({ mode: 'open' })        
        this.icon = this.attr('icon')
        this.src = this.attr('src')
    }
    async connectedCallback () {
        const { icon } = this
        if (!icon) {
            return 
        }
        const url = icon.includes('/') ? icon : `${kPrefix}/${icon}.svg`
        const svg = (await $fetchText(url)).replace(/<title>.*<\/title>/, '')
        this.root.innerHTML = HTML(svg) // html`<div style="fill: var(--color); width: var(--width);">${svg}</div>`
    }
    setIcon (name) {
        this.icon = name
        this.connectedCallback()
    }
    // static get observedAttributes() { 
    //     return ['icon'] 
    // }
    // attributeChangedCallback(name, oldValue, newValue) { 
    //     this.setIcon(newValue)
    // }
})