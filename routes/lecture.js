var async = require('async');

exports.searchLecture = function(req, res) {
	var keyword = req.query.keyword;
	var subject = req.query.subject || false;
	var sbid = req.query.sbid || "0";
	var flag = false;

	if(keyword == undefined || keyword == null) {
		console.error("keyword is undefined");
		res.json(null);
		return;
	}
	async.waterfall([
		function(cb) {
			var queryStr = "SELECT * FROM tlecture WHERE discd = 0 ";
			if(keyword != "")
				queryStr += " AND lname like '%" + keyword + "%'";
			else if(sbid !== "0") {
				queryStr += " AND sbid = " + sbid;
			}
			queryStr += " ORDER BY sbid ";

			res.db.query(queryStr, [], function(error, result) {
				if(error) {
					console.error("Error#1" + error);
					cb(error, null);
				} else {
					cb(null, result);
				}
			});
		}, function(lclist, cb) {
			if(keyword == "") {
				cb(null, lclist);
			} else {
				async.eachSeries(lclist, function(sb,ecb) {
					if(keyword == sb.lname) {
						flag = true;
					}
					if(subject) {
						var queryStr = "SELECT sbname FROM tsubject WHERE sbid = ?";
						res.db.query(queryStr, [sb.sbid], function(error, result) {
							if(error) ecb(error);
							else {
								if(result.length > 0)
									sb.sbname = result[0].sbname;
								ecb(null);
							}
						});
					} else {
						ecb(null);
					}
				}, function(){
					cb(null, lclist);
				});
			}
		}
		], function(error, lclist) {
			if(error) {
				console.error(error);
				res.json(null);
				return;
			}
			res.json({flag: flag, list: lclist});
		});
}

exports.saveLecture = function(req, res) {
	var lecture = req.body.lecture;

	if(lecture == undefined || lecture == null) {
		console.error("lecture is undefined");
		res.json(null);
		return;
	}

	var queryStr = "INSERT INTO tlecture (lname, sbid, semester) VALUES (?,?,?)";
	res.db.query(queryStr, [lecture.lname, lecture.sbid, lecture.semester], function(error, result) {
		if(error) {
			console.error(error);
			res.json(null);
			return;
		}
		res.json("OK");
	});
}

exports.deleteLecture = function(req, res) {
	var lid = req.body.lid;

	var queryStr = "UPDATE tlecture SET discd = 1 where lid = ? ";
	res.db.query(queryStr, [lid], function(error, result) {
		if(error) {
			console.log("deleteLecture Error");
			console.log(error);
			res.json(null);
		} else res.json("OK");
	});
}