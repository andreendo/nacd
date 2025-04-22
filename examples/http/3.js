const http = require('https')
const options = {
    hostname: 'example.com',
    path: '/',
    method: 'GET'
}

const req = http.request(options, (res) => {
    console.log(`statusCode: ${res.statusCode}`)

    res.on('data', () => {
        console.log('data');
    })

    res.on('end', () => {
        console.log('end');
    })
})

req.end();