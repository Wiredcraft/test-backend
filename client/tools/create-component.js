#!/usr/local/bin/node
const name = process.argv[2], 
      extendsFrom = process.argv[3] ?? 'Component',
      className = name.replace(/^./, char => char.toUpperCase()).replace(/-(.)/g, (_, char) => char.toUpperCase()),
      isVue = extendsFrom === 'VueComponent';

console.log(`class ${className} extends ${extendsFrom} {
    ${isVue ? `setup () {

        return {}
    }` : `async build () {
        
    }`
    }
}
${className}.$publish()
export default ${className}
`)

