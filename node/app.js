const HTTP = require('http')
const { $fetch, encrypt, decrypt, $query } = require('./tool')
const PORT = 1954
const { SERVER } = process.env
const $remote = SERVER === 'celwk'
const domain = $remote ? 'https://nodecraft.celwk.com' : 'https://node.wcraft.com'
HTTP.createServer(async (req, res) => {
    const { headers, url, method } = req
    console.log(headers)
    // console.log({ headers, url, method })

    res.writeHead(200, {'Content-Type': 'application/json'})

    const [fn, ...params] = url.split('/').filter(x => x).splice(1).map(x => decodeURI(x).underline())

    // For testing, login a random member
    if (fn === 'login') {
        const ip = headers['x-real-ip'], 
              location = 'Get From Cloud Server by IP',
              userAgent = headers['user-agent']
              
        const { mmid, name } = await $query(`SELECT * FROM test.login(ip => $1, location => $2, user_agent => $3)`, [ip, location, userAgent])

        const passport = encrypt(mmid.toString())
        const data = {
            state: ':ok',
            mmid, name, domain, passport,
            avatar: `/src/${mmid %7 + 1}.jpg`,
        }
        return res.end(JSON.stringify(data))
    }

    const from = Number.parseInt(decrypt(headers.passport))
    const values = [from] 
    const args = [`"from" => $1`]
    const data = []
    switch (method) {
        case 'GET':
            for (let i = 0; i < params.length; i += 2) {
                data.push([params[i], decodeURIComponent(params[i + 1])])
            }
            break
        case 'POST':
            data.push(...Object.entries(await $fetch(req)))
            break
    }
    for (let i = 0; i < data.length; i++) {
        const [key, value] = data[i]
        args.push(`"${key.underline()}" => $${i + 2}`)
        values.push(value)
    }

    const code = sql`SELECT jsonb::text FROM ${fn}(${args.join(', ')}) as jsonb`;
    console.log({ fn, values, code })
    const { jsonb } = await $query(code, values);

    res.end(jsonb || 'null');
}).listen(PORT);

console.log(`Server running at ${domain}`);