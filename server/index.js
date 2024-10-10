const server = require('http').createServer((req, res) => {
  res.writeHead(204, {
    'access-control-allow-origin': '*',
    'access-control-allow-methods': 'OPTIONS, POST, GET, PATCH',
  })
  res.end('hello my friend')
})

const socketIo = require('socket.io')
const io = socketIo(server, {
  cors: {
    origin: '*',
    credentials: false
  }
})

io.on('connection', socket => {
  console.log(`connection`, socket.id)
  socket.on('join-room', (roomId, userId) => {
    // [TIP] Adicona todos os usuarios que chegarem na mesma sala
    socket.join(roomId)
    socket.to(roomId).broadcast.emit('user-connected', userId)
    socket.on('disconnect', () => {
      console.log('disconected', roomId, userId)
      socket.to(roomId).broadcast.emit('user-disconnected', userId)
    })
  })
})

const startServer = () => {
  const { address, port } = server.address()
  console.info(`app runnning at ${address}:${port}`)
}

server.listen(process.env.PORT || 3000, startServer)