const PORT = process.env.PORT || 3000;

const express = require('express');
const app = express();

const server = require('http').Server(app);
const io = require('socket.io')(server);

let onlineCount = 0;
let wait = 0;
let waitIP;
let room = {};

app.get('/', (req, res) => {
    res.sendFile( __dirname + '/views/index.html');
});
app.get('/game', (req, res) => {
	res.sendFile( __dirname + '/views/game.html');
});
 

io.on('connection', (socket) => {
    //console.log('Hello!');
	onlineCount++;
    io.emit("online", onlineCount);
	
	socket.on("send", (msg) => {
	console.log(msg);
        io.emit("msg", msg);
    });

	
    socket.on('disconnect', () => {
        onlineCount = (onlineCount < 0) ? 0 : onlineCount-=1;
        io.emit("online", onlineCount);
    });
	
	socket.on("data_canvas",(data)=>{
		console.log(data);
		io.emit("new_draw",data);
	});
	
	socket.on("clear_canvas",()=>{
		console.log("clear_canvas");
		io.emit("all_clear");
	});
	
	socket.on("color_change",()=>{
		console.log("clear_canvas");
	});
	
	socket.on("gamestart",()=>{
		var address = socket.handshake.address;
		console.log(address + "join the gamewait.");
		io.send("startseccess",address);
		/*if(wait == 1){
			room["player1"] = waitIP;
			room["player2"] = address;
			wait = 0;
			io.send("startseccess");
		}
		else{
			waitIP = address;
			wait = 1;
		}*/
	});
	
	socket.on("playerdata",(data)=>{
		console.log(data);
		io.emit("player2", data);
	});
});
 

server.listen(PORT, () => {
    console.log("Server Started. http://localhost:3000");
});
 
