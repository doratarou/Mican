//server
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mysql = require('mysql');


const app = express();//サーバーを作る
const server = http.Server(app);//Expressを使用してhttpにサーバーを立てる 

const io = socketIo(server);//プロトコルをアップグレードする

const PORT = 3000;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');//__dirname＝Pwd 相対ぱすになってる　
});

server.listen(PORT, () => {///城の門を開ける
  console.log(`listening on port ${PORT}`);

});


io.on('connection', (socket) => {//人が入ってきたら
  console.log('user connected');



  socket.on('sendMessage', (message) => {//送信されたら  sendMassageはいじれる
    console.log(message);

    

    console.log('name: ', message.name);

    console.log('sent: ', message.sent);
    //message の Id は　どこのスレかということ

    const today = new Date(Date.now() + ((new Date().getTimezoneOffset() + (9 * 60)) * 60 * 1000));
    let date = `${today.getFullYear()}年${today.getMonth()+1}月${today.getDate()}日${today.getHours()}時${today.getMinutes()}分${today.getSeconds()}秒`;

    message["time"] = date;
    console.log("time:", message.time);
    //message が　オブジェクトでSQLに入れるべきもの


    const connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'root',
      database: 'mymican'
    });

    connection.connect((err) => {
      if (err) {
        console.log('error connecting: ' + err.stack);
        return;
      }
      console.log('success');
    });

    var q = "INSERT INTO micanTb(time_?,name_?,sent_?) values(?,?,?)";
　　　connection.query(q,[message.id,message.id,message.id,message.time,message.name,message.sent],function (err, result) {


    });




    // 'receiveMessage' というイベントを発火、受信したメッセージを全てのクライアントに対して送信する
    io.emit('receiveMessage', message);//message を　オブジェクトにして　{name : 太朗, sent : 腹へった, time:2021年〜分}　的な感じにした方が良さげ
  });





  
});