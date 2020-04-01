import http from 'http'
import sirv from 'sirv'
import polka from 'polka'
import io from 'socket.io'
import compression from 'compression'
import * as sapper from '@sapper/server'

const { PORT, NODE_ENV } = process.env
const dev = NODE_ENV === 'development'

const server = http.createServer()

polka({ server }) // You can also use Express
  .use(
    compression({ threshold: 0 }),
    sirv('static', { dev }),
    sapper.middleware()
  ).listen(PORT, err => {
    if (err) console.log('error', err)
  })

io(server).on('connection', socket => {
  socket.on('new data', data => {
    socket.broadcast.emit('new data', data)
  })
})
