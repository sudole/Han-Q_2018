var async = require('async');

exports.openCenter = function(req, res) {
	var code = req.session.user.code;
	
	res.render('center.html');
}

exports.openCenter2 = function(req, res) {
	res.render('center_2.html', {name: "임수진"});
}

exports.openCenterStudent = function(req, res) {
	var code = req.session.user.code;
	var stdLecs = [];
	var student = {sname:'',uid:'',scode:code};

	async.waterfall([
		function(wcb) {
			var queryStr1 = "SELECT sid UID, sname SNAME FROM tstudent WHERE scode = '" + code + "' AND discd = 0 ";	
			
			res.db.query(queryStr1, [], function(error, result) {
				if(error) {
					console.log(error);
					wcb(error);
				} else {
					student.sname = result[0].SNAME;
					student.uid = result[0].UID;
					wcb(null);
				}
			});
		}, function(wcb) {
			var queryStr2 = "SELECT lid FROM tlecmember WHERE sid = '" + student.uid + "' ";
			res.db.query(queryStr2, [], function(error, result) {
				if(error) {
					console.log(eror);
					wcb(error);
				} else {
					wcb(null, result);
				}
			});
		}, function(lids, wcb) { //console.log(lids);
			// tlecture, tmktest Select...... lecname, testinfo...
			async.eachSeries(lids, function(lid, ecb) {
				var queryStr3 = "SELECT L.lname LNAME, IFNULL(T.testname, '') TESTNAME, IFNULL(T.testdate, '') TESTDATE, \n"
				+ " IFNULL(T.sttime, '') STTIME, IFNULL(T.endtime, '') ENDTIME, \n"
				+ " IFNULL(S.sbname, '') SBNAME, IFNULL(T.mktid, '0') MKTID, \n"
				+ " IFNULL(C.scid, '-1') TLAG"
				+ "  FROM tmktest T JOIN tfintest F ON T.mktid = F.mktid AND T.discd = 0 \n"
				+ " JOIN tlecture L ON T.lid = L.lid AND L.discd = 0 \n"
				+ " JOIN tsubject S ON L.sbid = S.sbid \n"
				+ " LEFT JOIN tscorecard C ON T.mktid = C.mktid AND C.sid = ? \n"
				+ " WHERE L.lid = ? GROUP BY T.mktid ";
				res.db.query(queryStr3, [student.uid, lid.lid], function(error, result) { 
					if(error) {
						console.log(error);
						ecb(error);
					} else {
						if(result.length > 0) {stdLecs = stdLecs.concat(result);} 
						ecb(null);
					}
				});
			}, function(error) {
				wcb(error);
			});
		}
		],
		function(error, result) {
			if(error) {
				console.log("Error...");
				console.log(error);
				res.render('error.html');
			} else {
				res.render('centerStudent.html', {stdLecs: stdLecs, student: student});
			}
		});
}