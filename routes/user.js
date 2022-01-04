var async = require('async');

exports.openSaveNewUser = function(req, res) {
	res.render('saveNewUser.html');
}

exports.openFindUser = function(req, res) {
	res.render('findUser.html');
}

exports.searchUser = function(req, res) {
	var user = req.body.user;

	var queryStr = '';
	if(user.name == undefined || user.code == undefined) {
		console.log('undefined user Info...' + JSON.stringify(user));
		res.json(null);
		return;
	}
	queryStr = " SELECT * FROM tstudent WHERE sname = ? AND scode = ? AND discd = 0 ";
	res.db.query(queryStr, [user.name, user.code], function(error, results) {
		if(error) {
			console.error(error);
			res.json(0);
			return;
		}
		res.json(results);
	});
}

exports.updateUser = function(req, res) {
	var user = req.body.user;

	var queryStr = '';
	if(user == undefined) {
		console.log('undefined user...');
		res.json(null);
		return;
	}
	queryStr = " UPDATE tstudent SET sname = ?, scode = ?, userid = ?, \n"
	+ " passwd = ?, sphone = ? WHERE sid = ? ";
	res.db.query(queryStr, [user.sname, user.scode, user.userid, user.passwd, user.sphone,
		user.sid], function(error, result) {
			if(error) {
				console.error(error);
				res.json(null);
				return;
			}
			res.json("OK");
		});
}

exports.findUser = function(req, res) {
	var user = req.body.user;
	var queryStr = '', param = [user.sname, user.scode];

	if(user == undefined) {
		console.log('undefined user...');
		res.json(null);
		return;
	}

	if(user.purpose == "ID") {
		queryStr = "SELECT IFNULL(userid,'') userid "
	} else if(user.purpose == "PW") {
		queryStr = "SELECT IFNULL(passwd,'') passwd "
	}

	queryStr += " FROM tstudent WHERE sname = ? AND scode = ? AND discd = 0 ";
	if(user.sphone != "" && user.sphone != undefined) {
		queryStr += " AND sphone = ? ";
		param.push(user.sphone);
	}
	res.db.query(queryStr, param, function(error, result) {
		if(error) {
			console.error(error);
			res.json(null);
			return;
		}
		res.json(result);
	});
}

exports.addStudent = function(req, res) {
	var student = req.body.student;
	var queryStr = "";

	async.waterfall([
		function(wcb) {
			queryStr = "SELECT * FROM tstudent WHERE sname = '" + student.sname + "' AND scode = '" + student.scode + "' AND discd = 0 ";
			res.db.query(queryStr, [], function(error, result) {
				if(error) {
					console.log(error);
					wcb(error);
				} else {
					if(result.length > 0) {
						wcb(null, result[0].sid);
					} else {
						wcb(null, 0);
					}
				}
			});
		},
		function(sid, wcb) {
			if(sid == 0) {
				queryStr = "INSERT INTO tstudent (sname, scode, passwd) VALUES ('" + student.sname + "', '" + student.scode + "', '1234');";
				res.db.query(queryStr, [], function(error, result) {
					if(error) {
						console.log(error);
						wcb(error);
					} else {
						wcb(null,result.insertId);
					}
				});
			} else wcb(null, sid);
		},
		function(sid, wcb) {
			queryStr = "INSERT INTO tlecmember (sid, lid) VALUES (" + sid + ", " + student.lid + "); ";
			res.db.query(queryStr, [], function(error, result) {
				if(error) {
					console.log(error);
					wcb(error);
				} else {
					wcb(null);
				}
			});
		}
		], function(error) {
			if(error) {
				console.log(error);
				res.json(null);
				return;
			}
			res.json("OK");
		});
}

exports.searchStudent = function(req, res) {
	var lid = req.body.lid;

	var queryStr = "SELECT s.* FROM tstudent s JOIN tlecmember l ON s.sid = l.sid AND s.discd = 0 ";
	if(lid != "" && lid != "0") {
		queryStr += " WHERE l.lid = " + lid;
	}	
	queryStr +=  " GROUP BY scode ORDER BY scode";
	res.db.query(queryStr, [], function(error, result) {
		if(error) {
			console.log(error);
			res.json(null);
			return;
		}
		res.json(result);
	});
}

exports.deleteStudent = function(req, res) {
	var sid = req.body.sid;

	var queryStr = "UPDATE tstudent SET discd = 1 WHERE sid = ? ";
	res.db.query(queryStr, [sid], function(error, result) {
		if(error) {
			console.log("deleteStudent Error");
			console.log(error);
			res.json(null);
		} else res.json("OK");
	});
}