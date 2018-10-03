let app = require('express')();
let http = require('http').Server(app);
let io = require('socket.io')(http);
let crypto = require('crypto');

// mongoose 모듈 가져오기
var mongoose = require('mongoose');
// testDB 세팅
mongoose.connect('mongodb://172.17.0.2:27017/testDB');
// 연결된 testDB 사용
var db = mongoose.connection;
// 연결 실패
db.on('error', function () {
    console.log('Connection Failed!');
});

// 연결 성공
db.once('open', function () {
    console.log('Connected!');
});
var accountInfo = mongoose.Schema(
    {
        id: String, password: String, name: String, email: String, comment: String,
        phone: Number, salt: String,
        log: [String]
    }
);

// 정의된 스키마를 객체처럼 사용할 수 있도록 model() 함수로 컴파일
var AccountInfo = mongoose.model('Schema', accountInfo);

var str = '';





/*
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});*/

io.on('connection', function (socket) {
    socket.on('message', function (id, msg) {

        console.log('message receivced from ' + id + ' :' + msg);

        AccountInfo.findOne({ id: id }, function (error, findAccountInfo) {
            if (error == null && findAccountInfo != null) {
                findAccountInfo.log.push(msg);

                if (findAccountInfo.log.length > 30) {
                    findAccountInfo.log.shift();
                }

                findAccountInfo.save(function (error, data) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Saved!')
                    }
                });

                io.emit('message', id + ' : ' + msg);
            }
        });
    });
});

var accountResInfo = 
    {
        id: String, name: String, email: String, comment: String,
        phone: Number, log: [String]
    };

io.on('connection', function (socket) {
    socket.on('loginReq', function (id, pw) {
        console.log('loginReq: ' + id + ' / ' + pw);
        io.emit('message', 'loginReq: ' + id);

        AccountInfo.findOne({ id: id }, function (error, findAccountInfo) {
            if (findAccountInfo != null) {
                crypto.pbkdf2(pw, findAccountInfo.salt, 143678, 64, 'sha512', (err, key) => {
                    if (key.toString('base64') == findAccountInfo.password) {
                        
                        accountResInfo.id = findAccountInfo.id;
                        accountResInfo.name = findAccountInfo.name;
                        accountResInfo.email = findAccountInfo.email;
                        accountResInfo.comment = findAccountInfo.comment;
                        accountResInfo.phone = findAccountInfo.phone;
                        accountResInfo.log = findAccountInfo.log;

                        console.log(accountResInfo.id + accountResInfo.name + accountResInfo.email);

                        io.to(socket.id).emit('loginRes', accountResInfo);
                    }
                    else
                    {
                        console.log('key :' + key.toString('base64'));
                        console.log('pw :' + findAccountInfo.id + ' ' +  findAccountInfo.password);

                        io.to(socket.id).emit('loginRes', 'Fail');
                    }
                });
            }
            else
            {
                io.to(socket.id).emit('loginRes', 'Fail');
            }
        });
    });
});

function getRandomInt(min, max) { //min ~ max 사이의 임의의 정수 반환
    return Math.floor(Math.random() * (max - min)) + min;
}


io.on('connection', function (socket) {
    socket.on('registerRpt', function (id, pw, name, email, comment, phone) {
        console.log('registerRpt: ' + id + pw);
        //1. 이미 등록된 id 있는지 체크
        AccountInfo.findOne({ id: id }, function (error, findAccountInfo) {
            if (findAccountInfo == null) {
                //2.1 이미 등록된 거 없으면 성공 등록 진행
                console.log(error);
                crypto.randomBytes(64, (err, buf) => {
                    crypto.pbkdf2(pw, buf.toString('base64'), 143678, 64, 'sha512', (err, key) => {
                        
                        var newAccount = new AccountInfo({
                            id: id, password: key.toString('base64'), name: name, email: email, phone: phone, comment: comment,
                            salt: saltValue = buf.toString('base64')
                        });
                        newAccount.save(function (error, data) {
                            if (error) {
                                console.log(error);
                            } else {
                                console.log('Saved!')
                                //3 등록 성공 registerrpt 전송
                                io.emit('registerRpt', "Succeed");
                            }
                        });                        
                    });
                });  
            }
            else {
                //2.2 이미 등록된 거 있으면 실패 register-fail 전송
                io.emit('registerRpt', "Fail");
                console.log(findAccountInfo + ' Exist');
            }
        });
    });
});

io.on('connection', function (socket) {
    console.log('a user connected');
    socket.broadcast.emit('message', "a user connected!");
    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
});

http.listen(5000, function () {
    console.log('listening on *:5000');
    AccountInfo.find(function (error, students) {
        console.log('--- Read all ---');
        if (error) {
            console.log(error);
        } else {
            console.log(students);
            console.log(students.log);
        }
    });
});
