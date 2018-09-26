let app = require('express')();
let http = require('http').Server(app);
let io = require('socket.io')(http);


// mongoose 모듈 가져오기
var mongoose = require('mongoose');
// testDB 세팅
mongoose.connect('mongodb://localhost:27017/testDB');
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
    { id: String, password: String, name: String, email: String, comment: String, log: [String] }
);

// 정의된 스키마를 객체처럼 사용할 수 있도록 model() 함수로 컴파일
var AccountInfo = mongoose.model('Schema', accountInfo);

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

io.on('connection', function (socket) {
    socket.on('loginRpt', function (id, pw) {
        console.log('loginRpt: ' + id + ' / ' + pw);
        io.emit('message', 'loginRpt: ' + id);
        AccountInfo.findOne({ id: id, password: pw }, function (error, findAccountInfo) {
            if (findAccountInfo != null) {
                io.to(socket.id).emit('loginRpt', 'Succeed');
            }
            else {
                io.emit('loginRpt', 'Fail');
            }
        });
    });
});

io.on('connection', function (socket) {
    socket.on('registerRpt', function (id, pw, name, email, comment) {
        console.log('registerRpt: ' + id + pw);
        //1. 이미 등록된 id 있는지 체크
        AccountInfo.findOne({ id: id }, function (error, findAccountInfo) {
            if (findAccountInfo == null) {
                //2.1 이미 등록된 거 없으면 성공 등록 진행
                console.log(error);
                var newAccount = new AccountInfo({ id: id, password: pw, name: name, email: email, comment: comment });
                newAccount.save(function (error, data) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Saved!')
                    }
                });

                //3 등록 성공 registerrpt 전송
                io.emit('registerRpt', "Succeed");
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
