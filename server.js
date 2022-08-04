var http = require('http')
var fs = require('fs')
var url = require('url')
const { text } = require('stream/consumers')
var port = process.argv[2]

if (!port) {
    console.log('请指定端口号')
    process.exit(1)
}

var server = http.createServer(function (request, response) {
    var parUrl = url.parse(request.url, true)
    var pathWithQuery = request.url
    var queryString = ''
    if (pathWithQuery.indexOf('?') > 0) {
        queryString = pathWithQuery.substring(pathWithQuery.indexOf('?'))
    }

    var path = parUrl.pathname
    var query = parUrl.query
    var method = request.method

    console.log('有请求过来啦！路径（带查询参数）为：' + pathWithQuery)

    response.statusCode = 200
    // 默认首页
    const filePath = path === '/' ? '/index.html' : path
    console.log(filePath);
    const index = filePath.lastIndexOf('.')
    
    // 后缀
    const suffix = filePath.substring(index)
    
    const fileType = {
        '.html' : 'text/html',
        '.css' : 'text/css',
        '.js' : 'text/javascript',
        '.png' : 'image/png',
        '.jpg' : 'image/jpg'
    }

    response.setHeader('Content-Type', `${fileType[suffix]}` || 'text/html;charset=utf-8')

    let content
    try {
        content = fs.readFileSync(`./public${filePath}`)
    } catch(error) {
        content = '文件不存在'
        response.statusCode = 404
    }

    response.write(content)
    response.end()


})

server.listen(port)
console.log('监听' + port + '端口成功\n点击打开 http://localhost:' + port);