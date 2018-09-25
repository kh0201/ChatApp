let app = require('express')();
let http = require('http').Server(app);
let io = require('socket.io')(http);


// 1. mongoose 모듈 가져오기
var mongoose = require('mongoose');
// 2. testDB 세팅
mongoose.connect('mongodb://localhost:27017/testDB');
// 3. 연결된 testDB 사용
var db = mongoose.connection;
// 4. 연결 실패
db.on('error', function(){
    console.log('Connection Failed!');
});
// 5. 연결 성공
db.once('open', function() {
    console.log('Connected!');
});
var accountInfo = mongoose.Schema(
    {id : String, password : String, name : String, email : String, comment : String, log : [String]}
    );

function arrayLimit(val) {
    return val.length <= 30;
  }

//// 7. 정의된 스키마를 객체처럼 사용할 수 있도록 model() 함수로 컴파일
var AccountInfo = mongoose.model('Schema', accountInfo);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket)
{
    socket.on('message', function(id, msg){

        console.log('message receivced from ' + id + ' :' + msg);

        AccountInfo.findOne({id: id}, function(error, findAccountInfo)
        {
            if(error == null &&  findAccountInfo != null)
            {
                findAccountInfo.log.push(msg);
                findAccountInfo.save(function(error, data){
                    if(error){
                        console.log(error);
                    }else{
                        console.log('Saved!')
                    }
                });                
            }
        });
    });
});

io.on('connection', function(socket)
{
  socket.on('loginRpt', function(id, pw){
    console.log('loginRpt: ' + id + pw);
	io.emit('message', 'loginRpt: ' + id);    
    AccountInfo.findOne({id: id, password: pw}, function(error, findAccountInfo)
    {
        if(findAccountInfo != null)
        {
            io.emit('loginRpt', 'Succeed');
        }
        else
        {
            io.emit('loginRpt', 'Fail');
        }
    });
  });
});

io.on('connection', function(socket)
{
    socket.on('registerRpt', function(id, pw, name, email, comment){
        console.log('registerRpt: ' + id + pw);   
        //1. 이미 등록된 id 있는지 체크
        AccountInfo.findOne({id: id}, function(error, findAccountInfo)
        {
            if(findAccountInfo == null)
            {
                //2.1 이미 등록된 거 없으면 성공 등록 진행
                console.log(error);
                var newAccount = new AccountInfo({id: id, password: pw, name:name, email: email, comment:comment});
                newAccount.save(function(error, data){
                    if(error){
                        console.log(error);
                    }else{
                        console.log('Saved!')
                    }
                });

                //3 등록 성공 registerrpt 전송
                io.emit('registerRpt', "Succeed");
            }
            else
            {
                //2.2 이미 등록된 거 있으면 실패 register-fail 전송
                io.emit('registerRpt', "Fail");
                console.log(findAccountInfo + ' Exist');
            }
        });
    });
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.broadcast.emit('message', "a user connected!");
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

http.listen(5000, function(){
  console.log('listening on *:5000');
  AccountInfo.find(function(error, students){
    console.log('--- Read all ---');
    if(error){
        console.log(error);
    }else{
        console.log(students);
        console.log(students.log);
    }
  });

  
  /*AccountInfo.deleteMany(function(error,output){
    console.log('--- Delete ---');
    if(error){
        console.log(error);
    }

     //( SINCE DELETE OPERATION IS IDEMPOTENT, NO NEED TO SPECIFY )
       // 어떤 과정을 반복적으로 수행 하여도 결과가 동일하다. 삭제한 데이터를 다시 삭제하더라도, 존재하지 않는 데이터를 제거요청 하더라도 오류가 아니기 때문에
        //이부분에 대한 처리는 필요없다. 그냥 삭제 된것으로 처리
        
    console.log('--- deleted ---');
});*/


});

/*
io.on('connection', function(socket){
  
});
*/



/*

// 8. Student 객체를 new 로 생성해서 값을 입력
var newStudent = new Student({name:'Hong Gil Dong', address:'서울시 강남구 논현동', age:'22'});
//var newStudent2 = new Student({name:'Kim Gil Dong', address:'서울시 관악구 신림동', age:'23'});

// 9. 데이터 저장
newStudent.save(function(error, data){
    if(error){
        console.log(error);
    }else{
        console.log('Saved!')
    }
});

newStudent2.save(function(error, data){
    if(error){
        console.log(error);
    }else{
        console.log('Saved!')
    }
});

// 10. Student 레퍼런스 전체 데이터 가져오기
Student.find(function(error, students){
    console.log('--- Read all ---');
    if(error){
        console.log(error);
    }else{
        console.log(students);
    }
})

// 11. 특정 아이디값 가져오기
Student.findOne({name:'Kim Gil Dong'}, function(error,student){
    console.log('--- Read one ---');
    if(error){
        console.log(error);
    }else{
        console.log(student);
    }
});

// 12. 특정아이디 수정하기
Student.findById({name:'Hond Gil Dong'}, function(error,student){
    console.log('--- Update(PUT) ---');
    if(error){
        console.log(error);
    }else{
        student.name = '--modified--';
        student.save(function(error,modified_student){
            if(error){
                console.log(error);
            }else{
                console.log(modified_student);
            }
        });
    }
});

// 13. 삭제
Student.deleteOne({name:'Hond Gil Dong'}, function(error,output){
    console.log('--- Delete ---');
    if(error){
        console.log(error);
    }

     //( SINCE DELETE OPERATION IS IDEMPOTENT, NO NEED TO SPECIFY )
       // 어떤 과정을 반복적으로 수행 하여도 결과가 동일하다. 삭제한 데이터를 다시 삭제하더라도, 존재하지 않는 데이터를 제거요청 하더라도 오류가 아니기 때문에
        //이부분에 대한 처리는 필요없다. 그냥 삭제 된것으로 처리
        
    console.log('--- deleted ---');
});
*/