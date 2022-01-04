var async = require('async');

exports.searchSubject = function(req, res) {
	var keyword = req.query.keyword;
	var flag = false;

	if(keyword == undefined || keyword == null) {
		console.error("keyword is undefined");
		res.json(null);
		return;
	}
	async.waterfall([
		function(cb) {
			var queryStr = "SELECT * FROM tsubject ";
			if(keyword != "")
				queryStr += " WHERE sbname like '%" + keyword + "%'";

			res.db.query(queryStr, [], function(error, result) {
				if(error) {
					console.error("Error#1" + error);
					cb(error, null);
				} else {
					cb(null, result);
				}
			});
		}, function(sblist, cb) {
			if(keyword == "") {
				cb(null, sblist);
			} else {
				async.eachSeries(sblist, function(sb,ecb) {
					if(keyword == sb.sbname) {
						flag = true;
					}
					ecb(null);
				}, function(){
					cb(null, sblist);
				});
			}
		}
		], function(error, sblist) {
			if(error) {
				console.error(error);
				res.json(null);
				return;
			}
			res.json({flag: flag, list: sblist});
		});
}

exports.saveSubject = function(req, res) {
	var subject = req.body.subject;

	if(subject == undefined || subject == null) {
		console.error("subject is undefined");
		res.json(null);
		return;
	}

	var queryStr = "INSERT INTO tsubject (sbname) VALUES (?)";
	res.db.query(queryStr, [subject], function(error, result) {
		if(error) {
			console.error(error);
			res.json(null);
			return;
		}
		res.json("OK");
	});
}

exports.updateSubject = function(req, res) {
	var sbname = req.body.sbname;
	var sbid = req.body.sbid;

	var queryStr = "UPDATE tsubject SET sbname = ? WHERE sbid = ? ";
	res.db.query(queryStr, [sbname, sbid], function(error, result) {
		if(error) {
			console.log("updateSubject Error");
			console.log(error);
			res.json(null);
		} else res.json("OK");
	});
}

exports.deleteSubject = function(req, res) {
	var sbid = req.body.sbid;

	var queryStr = "DELETE FROM tsubject WHERE sbid = ? ";
	res.db.query(queryStr, [sbid], function(error, result) {
		if(error) {
			console.log("deleteSubject Error");
			console.log(error);
			res.json(null);
		} else res.json("OK");
	});
}