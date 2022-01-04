var http = require('http');
var fs = require('fs');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var session = require('express-session');

var app = express();

// session
app.use(session({
	secret: 'qzonlie09876543210',
	resave: false,
	saveUninitialized: true
}));

// routes folder setting
var user = require('./routes/user');
var center = require('./routes/center');
var subject = require('./routes/subject');
var login = require('./routes/login');
var testMng = require('./routes/testMng');
var lecture = require('./routes/lecture');

// port setting
app.set('port', (process.env.PORT || 3000));
var port = app.get('port');

// // mysql connection
var conn = require('./db-config');
conn.connect();

// body parser, Post Request Data Parameter
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// plugin, css, js file path
app.use('/plugins', express.static(path.join(__dirname, 'plugins')));
app.use('/css', express.static(path.join(__dirname, 'public/css')));
app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use('/js', express.static(path.join(__dirname, 'public/js')));

// view html setting
app.set('views', path.join(__dirname, '/views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// DB Connect Method Setting
app.all('*', function(req, res, next) {
	if(req.url == '/index.html' || 
		(['/reqLogin','/findUser.html', '/findUser','/saveNewUser.html','/searchUser','/updateUser'].indexOf(req.url) == -1 && req.session.user == undefined)) req.url = '/';
	
	if(req.url != '/') {
		console.log('['+req.method+'] '+req.url);
		res.db = conn;
	}
	next();
});

// initialize
app.get('/', function(req, res) {
	var url = req.url;
	if(req.url == '/') {
		url = '/index.html';
	}
	res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
	res.end(fs.readFileSync(__dirname + url));
});

app.get('/saveNewUser.html', user.openSaveNewUser);
app.get('/findUser.html', user.openFindUser);
app.post('/searchUser', user.searchUser);
app.post('/updateUser', user.updateUser);
app.post('/findUser', user.findUser);

app.get('/center.html', center.openCenter);		// professor
app.get('/center_2.html', center.openCenter2);	//test
app.get('/centerStudent.html', center.openCenterStudent);	// student
app.get('/searchSubject', subject.searchSubject);
app.post('/saveSubject', subject.saveSubject);
app.post('/updateSubject', subject.updateSubject);
app.post('/deleteSubject', subject.deleteSubject);

app.post('/reqLogin', login.reqLogin);

app.get('/examResult.html', testMng.openExamResult);
app.post('/regExam.html', testMng.openRegExam);
app.post('/saveExam', testMng.saveExam);
app.post('/searchExam', testMng.searchExam);
app.post('/deleteExam', testMng.deleteExam);
app.post('/getTestWithCondition', testMng.getTestWithCondition);
app.post('/getTestExam', testMng.getTestExam);
app.post('/saveStudentTestResult', testMng.saveStudentTestResult);
app.post('/getStudentTestResult', testMng.getStudentTestResult);
app.post('/updateTestPaper', testMng.updateTestPaper);
app.post('/makeTest.html', testMng.openMakeTest);
app.post('/saveTest', testMng.saveTest);
app.post('/finishTest', testMng.finishTest);
app.post('/deleteTest', testMng.deleteTest);
app.post('/saveAnswer', testMng.saveAnswer);
app.get('/checkStartTestTime', testMng.checkStartTestTime);
app.get('/checkTestTime', testMng.checkTestTime);

app.get('/searchLecture', lecture.searchLecture);
app.post('/saveLecture', lecture.saveLecture);
app.post('/deleteLecture', lecture.deleteLecture);

app.post('/addStudent', user.addStudent);
app.post('/searchStudent', user.searchStudent);
app.post('/deleteStudent', user.deleteStudent);

app.listen(port, function() {
	console.log('Server is running...' + port);
});