var async = require('async');
var dateutils = require('date-utils');

exports.openExamResult = function(req, res) {
	res.render("examResult.html");
}

exports.openRegExam = function(req, res) {
	var subject = req.body.subject;
	var sbid = req.body.sbid;
	
	res.render("regExam.html", {sbid:sbid, subject: subject});
}

exports.saveExam = function(req, res) {
	var exam = req.body.exam;
	var param = [];

	var queryStr = "INSERT INTO tregexam (sbid,lid,`type`,question,`comment`";

	var valueStr = " VALUES ("+exam.sbid+','+exam.lid+','+exam.etype+',"'+exam.question+'","'+exam.comment+'"';

	for (var i = 0; i < exam.answer.length; i++) {
		queryStr += ",answer" + (i+1);
		valueStr += ',"'+exam.answer[i]+'"';
	}
	queryStr += ") ";
	valueStr += ") ";
	res.db.query(queryStr+valueStr, param, function(error, result) {
		if(error) {
			console.log(error);
			res.json(null);
		} else {
			res.json("OK");	
		}
	});
}

exports.openMakeTest = function(req, res) {
	var tElement = req.body;

	res.render("makeTest.html", tElement);
}

exports.searchExam = function(req, res) {
	var sbid = req.body.sbid;
	var lid = req.body.lid || "";
	var param = [sbid];
	
	var queryStr = "SELECT * FROM tregexam WHERE sbid = ? ";
	if(lid !== "") {
		queryStr += " AND lid = ? ";
		param.push(lid);
	}
	queryStr += " ORDER BY type ";
	res.db.query(queryStr, param, function(error, result) {
		if(error) {
			console.log(error);
			res.json(null);
		} else {
			res.json(result);	
		}
	});
}

exports.saveTest = function(req, res) {
	var test = req.body.test;

	async.waterfall([
		function(wcb) {
			var queryStr = "INSERT INTO tmktest (testname, lid, testdate, sttime, endtime) VALUES (?, ?, ?, ?, ?) ";
			
			res.db.query(queryStr, [test.testname, test.lid, test.testdate, test.sttime, test.endtime], 
				function(error, result) {
					if(error) {
						console.log(error);
						wcb(error);
					} else {
						wcb(null, result.insertId);
					}
				});		
		},
		function(mktid, wcb) {
			async.eachSeries(test.oxExam, function(exam, ecb) {
				var queryStr1 = "INSERT INTO toxexam (mktid, reid, sn, point) VALUES (?, ?, ?, ?)";
				res.db.query(queryStr1, [mktid, exam.reid, exam.sn, exam.point], function(error, result) {
					if(error) {
						console.log(error);
						ecb(error);
					} else {
						ecb(null);
					}
				});
			}, function(error) {
				if(error) {
					console.log("saveTest...Error#2 oxExam Save");
				}
				wcb(error, mktid);
			});
		}, function(mktid, wcb) {
			async.eachSeries(test.blankExam, function(exam, ecb) {
				var queryStr2 = "INSERT INTO tblankexam (mktid, reid, sn, point) VALUES (?, ?, ?, ?)";
				res.db.query(queryStr2, [mktid, exam.reid, exam.sn, exam.point], function(error, result) {
					if(error) {
						console.log(error);
						ecb(error);
					} else {
						ecb(null);
					}
				});
			}, function(error) {
				if(error) {
					console.log("saveTest...Error#3 blankExam Save");
				}
				wcb(error);
			});
		}
		], function(error) {
			if(error) {
				console.log(error);
				res.json(null);
			} else {
				res.json("OK");	
			}
		});
}

exports.getTestWithCondition = function(req, res) {
	var conType = req.body.conType || "";
	var mktid = req.body.mktid || 0;

	async.waterfall([
		function(wcb) {
			var queryStr = "SELECT T.mktid MKTID, T.testname TESTNAME, T.testdate TESTDATE, \n"
			+ " T.sttime STTIME, T.endtime ENDTIME, S.sbname SBNAME, L.lname LNAME \n"
			+ " FROM tmktest T JOIN tlecture L ON T.lid = L.lid AND T.discd = 0 AND L.discd = 0 \n"
			+ " JOIN tsubject S ON L.sbid = S.sbid \n";

			if(mktid !== undefined && mktid > 0) {
				queryStr += " WHERE T.mktid = " + mktid + " ";
			}

			if(conType == 'subject') {
				queryStr += " ORDER BY S.sbname, T.testdate ";
			}

			res.db.query(queryStr, [], function(error, result) {
				if(error) {
					console.log("getTestWithCondition Error#1");
					console.log(error);
					wcb(error);
				} else {
					wcb(null, result);
				}
			});
		}, function(testlist, wcb) {
			async.eachSeries(testlist, function(tItem, ecb) {
				tItem.exams = [];

				async.series([
					function(scb) {
						var queryStr2 = "SELECT IFNULL(fintid, 0) fintid FROM tfintest WHERE mktid = ?";
						res.db.query(queryStr2, [tItem.MKTID], function(error, result) {
							if(error) {
								scb(error);
							} else {
								if(result.length > 0 && result[0].fintid > 0) {
									tItem.FIN = true;
								} else {
									tItem.FIN = false;
								}
								scb(null);
							}
						});						
					}, function(scb) {
						var queryStr3 = "SELECT R.`type`, O.oxeid 'eid', R.question, R.`comment`, "
						+ " concat(R.answer1, '/', IFNULL(R.answer2,''), '/', IFNULL(R.answer3,''), '/', IFNULL(R.answer4,''), '/', IFNULL(R.answer5,'')) 'answer', "
						+ " O.`point`, O.sn "
						+ " FROM tregexam R JOIN toxexam O ON R.reid = O.reid "
						+ " WHERE O.mktid = ? ";
						res.db.query(queryStr3, [tItem.MKTID], function(error, result) {
							if(error) {
								scb(error);
							} else {
								if(result.length > 0)
									tItem.exams = tItem.exams.concat(result);
								scb(null);
							}
						});
					}, function(scb) {
						var queryStr4 = "SELECT R.`type`, O.beid 'eid', R.question, R.`comment`, "
						+ " concat(R.answer1, '/', IFNULL(R.answer2,''), '/', IFNULL(R.answer3,''), '/', IFNULL(R.answer4,''), '/', IFNULL(R.answer5,'')) 'answer', "
						+ " O.`point`, O.sn "
						+ " FROM tregexam R JOIN tblankexam O ON R.reid = O.reid "
						+ " WHERE O.mktid = ? ";
						res.db.query(queryStr4, [tItem.MKTID], function(error, result) {
							if(error) {
								scb(error);
							} else {
								if(result.length > 0)
									tItem.exams = tItem.exams.concat(result);
								scb(null);
							}
						});
					}], function(result) {
						ecb(result);
					});
			}, function(error) {
				if(error) {
					console.log("getTestWithCondition Error#2");
					console.log(error);
					wcb(error);
				} else {
					wcb(null, testlist);
				}
			});
		}], function(error, result) {
			if(error) {
				console.log(error);
				res.json(null);
			} else {
				res.json(result);
			}
		});
}

exports.finishTest = function(req, res) {
	var mktid = req.body.mktid;
	var fintest = [];

	async.series({
		oxexam: function(scb) {getOxexamBymktid(res.db, mktid, scb);},
		blankexam: function(scb) {getBlankexamBymktid(res.db, mktid, scb);}
	}, function(error, result) {
		if(error) {
			console.log("finishTest Error");
			console.log(error);
			res.json(null);
		} else {
			if(result.oxexam.length > 0) {
				fintest = fintest.concat(result.oxexam);
			}
			if(result.blankexam.length > 0) {
				fintest = fintest.concat(result.blankexam);
			}
			addFinishTest(res.db, fintest, function(error) {
				if(error) {
					console.log("finishTest Error#2 addFinishTest..");
					console.log(error);
					res.json(null);
				} else {
					res.json("OK");
				}
			});
		}
	});
}

function getOxexamBymktid(db, mktid, callback) {
	var queryStr = "SELECT " + mktid + " mktid, B.type etype, B.question, "
	+ " B.comment, B.answer1, B.answer2, B.answer3, "
	+ " B.answer4, B.answer5, A.sn, A.point "
	+ " FROM toxexam A JOIN tregexam B ON A.reid = B.reid "
	+ " WHERE A.mktid = ?";
	db.query(queryStr, [mktid], function(error, result) {
		if(error) {
			console.log("getOxexamBymktid Error");
		}
		callback(error, result);
	});
}

function getBlankexamBymktid(db, mktid, callback) {
	var queryStr = "SELECT " + mktid + " mktid, B.type etype, B.question, "
	+ " B.comment, B.answer1, B.answer2, B.answer3, "
	+ " B.answer4, B.answer5, A.sn, A.point "
	+ " FROM tblankexam A JOIN tregexam B ON A.reid = B.reid "
	+ " WHERE A.mktid = ?";
	db.query(queryStr, [mktid], function(error, result) {
		if(error) {
			console.log("getBlankexamBymktid Error");
		}
		callback(error, result);
	});
}

function addFinishTest(db, fintest, callback) {
	async.eachSeries(fintest, function(item, ecb){
		var queryStr = "INSERT INTO tfintest (mktid, etype, question, comment, "
		+ " answer1, answer2, answer3, answer4, answer5, sn, point) "
		+ " VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
		db.query(queryStr, [item.mktid, item.etype, item.question, item.comment,
			item.answer1, item.answer2, item.answer3, item.answer4, item.answer5, item.sn, item.point],
			function(error, result) {
				if(error) {
					console.log("addFinishTest Error..");
				}
				ecb(error);
			});
	}, function(error) {
		callback(error);
	});
}

exports.getTestExam = function(req, res) {
	var mktid = req.body.mktid;

	var queryStr = "SELECT * FROM tfintest WHERE mktid = ? ORDER BY sn";
	res.db.query(queryStr, [mktid], function(error, result) {
		if(error) {
			console.log("getTestExam Error");
			console.log(error);
			res.json(null);
		} else {
			res.json(result);
		}
	});
}

exports.saveStudentTestResult = function(req, res) {
	var saveData = req.body.saveData;

	async.series([
		function(scb) {saveStudentGrade(res.db, saveData.stGrade, scb);},
		function(scb) {updateStudentScoreRank(res.db, saveData.stGrade.mktid, scb);},
		function(scb) {saveStudentAnswers(res.db, saveData.stAnswers, scb);}
		], function(error, result) {
			if(error) {
				console.log("saveStudentTestResult Error");
				console.log(error);
				res.json(null);
			} else {
				res.json("OK");
			}
		});
}

function saveStudentGrade(db, stGrade, callback) {
	var queryStr = "INSERT INTO tscorecard (sid,score,`rank`,mktid) VALUES (?,?,?,?); ";
	db.query(queryStr, [stGrade.sid, stGrade.score, stGrade.rank, stGrade.mktid], callback);
}

function updateStudentScoreRank(db, mktid, callback) {
	var queryStr = "UPDATE tscorecard s "
	+ " JOIN "
	+ " (SELECT "
	+ " scid, "
	+ " RANK()       OVER w AS 'rownum' "
	+ " FROM tscorecard sc WHERE   sc.mktid = ? "
	+ " WINDOW w AS (ORDER BY score desc) ) j ON s.scid = j.scid "
	+ " SET"
	+ "     s.`rank` = j.rownum; ";
	db.query(queryStr, [mktid], callback);
}

function saveStudentAnswers(db, stAnswers, callback) {
	async.eachSeries(stAnswers, function(answer, ecb) {
		saveAnswer(db, answer.asid, answer, ecb);
	}, callback);
}

exports.getStudentTestResult = function(req, res) {
	var mktid = req.body.mktid;
	var sid = req.body.sid;

	async.series({
		scorecard: function(scb) {getScoreCardOfStudent(res.db, mktid, sid, scb);},
		testpaper: function(scb) {getTestPaperOfStudent(res.db, mktid, sid, scb);}
	}, function(error, result) {
		if(error) {
			console.log("getStudentTestResult Error");
			console.log(error);
			res.json(null);
		} else {
			var testResult = {};
			testResult.scorecard = result.scorecard[0];
			testResult.testpaper = result.testpaper[0];
			res.json(testResult);
		}
	});
}

function getScoreCardOfStudent(db, mktid, sid, callback) {
	var queryStr = "SELECT score, `rank` FROM tscorecard WHERE mktid = ? AND sid = ? ";
	db.query(queryStr, [mktid, sid], callback);
}

function getTestPaperOfStudent(db, mktid, sid, callback) {
	var queryStr = "SELECT s.question, s.stanswer, s.point spoint, ft.point, "
	+ " concat(ft.answer1, '/', IFNULL(ft.answer2,''), '/', IFNULL(ft.answer3,''), '/', IFNULL(ft.answer4,''), '/', IFNULL(ft.answer5,'')) 'answer' "
	+ " FROM "
	+ " tanswersheet s "
	+ " JOIN "
	+ " tfintest ft ON s.fintid = ft.fintid "
	+ " WHERE ft.mktid = ? AND s.sid = ? "
	+ " ORDER BY ft.sn ";
	db.query(queryStr, [mktid, sid], callback);
}

exports.updateTestPaper = function(req, res) {
	var testpaper = req.body.testpaper;
	
	async.waterfall([
		function(wcb) {
			var queryStr = "UPDATE tmktest SET testname = ?, testdate = ?, sttime = ?, endtime = ? "
			+ " WHERE mktid = ? ";

			res.db.query(queryStr, [testpaper.testname, testpaper.testdate, testpaper.sttime, testpaper.endtime,
				testpaper.mktid], function(error, result) {
					if(error) {
						console.log("updateTestPaper Error#1");
						wcb(error);
					} else {
						wcb(null);
					}
				});
		}, function(wcb) {
			async.eachSeries(testpaper.exams, function(exam, ecb) {
				var queryStr2 = "";

				if(exam.eType == 0) {
					queryStr2 += "UPDATE toxexam SET `point` = ?, sn = ? WHERE oxeid = ? ";
				} else {
					queryStr2 += "UPDATE tblankexam SET `point` = ?, sn = ? WHERE beid = ? ";
				}
				res.db.query(queryStr2, [exam.point, exam.sn, exam.eid], ecb);
			}, function(error, result) {
				if(error) {
					console.log("updateTestPaper Error#2");
					wcb(error);
				} else {
					wcb(null);
				}
			});
		}], function(error) {
			if(error) {
				console.log(error);
				res.json(null);
			} else res.json("OK");
		});
}

exports.deleteTest = function(req, res) {
	var mktid = req.body.mktid;

	var queryStr = "UPDATE tmktest SET DISCD = 1 WHERE mktid = ?";
	res.db.query(queryStr, [mktid], function(error, result) {
		if(error) {
			console.log("deleteTest Error");
			console.log(error);
			res.json(null);
		} else res.json("OK");
	});
}

exports.deleteExam = function(req, res) {
	var reid = req.body.reid;

	var queryStr = "DELETE FROM tregexam WHERE reid = ? ";
	res.db.query(queryStr, [reid], function(error, result) {
		if(error) {
			console.log("deleteExam Error");
			console.log(error);
			res.json(null);
		} else res.json("OK");
	});
}

exports.saveAnswer = function(req, res) {
	var asid = req.body.asid;
	var data = req.body.data;
	var queryStr = "", param = [];


	saveAnswer(res.db, asid, data, function(error, result) {
		if(error) res.json({flag:false});
		else res.json({flag:true, asid:result});
	});
}

function saveAnswer(db, asid, data, callback) {
	// console.log("saveAnswer....\n"+asid+"\n"+JSON.stringify(data));
	if(asid != "") {
		queryStr = "UPDATE tanswersheet SET stanswer = ?, point = ? WHERE asid = ?"
		param = [data.stanswer, data.point, asid];
	} else {
		queryStr = "INSERT INTO tanswersheet (fintid, sid, question, stanswer, point)"
		+ " VALUES (?, ?, ?, ?, ?) ";
		param = [data.fintid, data.sid, data.question, data.stanswer, data.point];
	}

	db.query(queryStr, param, function(error, result) {
		if(error) {
			console.log("saveAnswer Function Error");
			console.log(error);
			callback(error, null);
		} else {
			if(asid == "") callback(null, result.insertId);
			else callback(null, asid);
		}
	});
}

exports.checkStartTestTime = function(req, res) {
	var mktid = req.query.mktid;
	var sttime = "", testdate = "", endtime = "", testStart = false;

	if(mktid == null || mktid == undefined) {
		console.log("checkStartTestTime Error: mktid is null/undefined...");
		res.json(false);
		return;
	}

	var queryStr = "SELECT testdate, sttime, endtime FROM tmktest WHERE mktid = ?";
	res.db.query(queryStr, [mktid], function(error, result) {
		if(error) {
			console.log("checkStartTestTime Error");
			console.log(error);
			res.json(false);
		} else {
			if(result.length > 0) {
				testdate = result[0].testdate;
				sttime = result[0].sttime;
				endtime = result[0].endtime;

				var now = new Date().toFormat('YYYYMMDDHH24MI');
				if(testdate == now.substr(0,8)) {
					if(sttime <= now.substr(8,4)) testStart = true;
					if(endtime <= now.substr(8,4)) testStart = false;
				}
				// console.log(now.substr(8,4), now.substr(0,8), testdate == now.substr(0,8))
				// console.log("checkStartTestTime :::" + "testdate=" + testdate + ", sttime=" + sttime + ", now="+now + ", flag=" + testStart);
				// console.log(testStart);
			}
			res.json({flag:testStart,testdate:testdate,sttime:sttime,endtime:endtime});
		}
	});
}

exports.checkTestTime = function(req, res) {
	var mktid = req.query.mktid;
	var endtime = req.query.endtime || "";
	var flag = req.query.flag;
	var now = new Date().toFormat("HH24MI");
	var chckResult = {flag:false,endtime:endtime};
	// console.log(req.query);
	if(flag == 0 || endtime == "") {
		var queryStr = "SELECT endtime FROM tmktest WHERE mktid = ?";
		res.db.query(queryStr, [mktid], function(error, result) {
			if(error) {
				console.log("checkTestTime Error");
				console.log(error);
				res.json(chckResult);
				return;
			}
			chckResult.endtime = result[0].endtime;
			if(chckResult.endtime <= now) chckResult.flag = true;
			// console.log("1");
			// console.log(chckResult);
			res.json(chckResult);
		});
	} else {
		if(endtime <= now) chckResult.flag = true;
		// console.log("2");
		// console.log(chckResult);
		res.json(chckResult);
	}
}