const mongoose = require('mongoose');
const dotenv = require('dotenv');
const http = require('http');

process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');
const { Socket } = require('socket.io');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => console.log('DB Connection is Successful!'));

const port = process.env.PORT || 3000;
const server = http.createServer(app);
server.listen(port, () => {
  console.log(`server connecting through port ${port}`);
});

let connectedPeers = [];
const io = require('socket.io')(server);
io.on('connection', socket => {
  connectedPeers.push(socket.id);
  console.log(connectedPeers);

  socket.on('pre-offer', data => {
    const { calleePersonalCode, callType } = data;

    const connectedPeer = connectedPeers.find(peerSocketId => {
      return peerSocketId === calleePersonalCode;
    });
    if (connectedPeer) {
      const data = {
        callerSocketId: socket.id,
        callType
      };
      io.to(calleePersonalCode).emit('pre-offer', data);
    } else {
      const data = {
        preOfferAnswer: 'CALLEE_NOT_FOUND'
      };
      io.to(socket.id).emit('pre-offer-answer', data);
    }
  });

  socket.on('pre-offer-answer', data => {
    const { callerSocketId } = data;
    const connectedPeer = connectedPeers.find(peerSocketId => {
      return peerSocketId === callerSocketId;
    });

    if (connectedPeer) {
      io.to(data.callerSocketId).emit('pre-offer-answer', data);
    }
  });

  socket.on('webRTC-signaling', data => {
    const { connectedUserSocketId } = data;

    const connectedPeer = connectedPeers.find(peerSocketId => {
      return peerSocketId === connectedUserSocketId;
    });

    if (connectedPeer) {
      io.to(connectedUserSocketId).emit('webRTC-signaling', data);
    }
  });

  socket.on('disconnect', () => {
    const newConnectedPeers = connectedPeers.filter(peerSocketId => {
      return peerSocketId !== socket.id;
    });

    connectedPeers = newConnectedPeers;
    console.log(connectedPeers);
  });
});

process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
