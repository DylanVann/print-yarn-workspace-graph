const fs = require('fs')
const path = require('path')
const { snakeCase } = require('lodash')

const glob = require('glob')

const packages = glob.sync('packages/*')

let mermaid = `graph TD;`

packages.forEach(p => {
    const jsonPath = path.join(__dirname, p, 'package.json')
    const exists = fs.existsSync(jsonPath)
    if (!exists) {
        return
    }

    const pkg = require(`./${p}/package.json`)
    const dependencies = Object.keys({
        ...pkg.dependencies,
        ...pkg.devDependencies,
    })

    const name = pkg.name.replace('@yourname', '')
    const activeUIDeps = dependencies
        .filter(v => v.includes('@yourname'))
        .map(v => v.replace('@yourname', ''))

    activeUIDeps.forEach(dep => {
        mermaid += `\n    ${snakeCase(dep)}-->${snakeCase(name)};`
    })
})
