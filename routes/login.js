exports.reqLogin = function(req, res) {
	var user = req.body.user;
	var queryStr = '';
	var cLen = user.scode.length;

	if(user == undefined) {
		console.log('undefined user...');
		res.json(null);
		return;
	}

	if(cLen == 9) {
		queryStr = "SELECT COUNT(*) CNT FROM tstudent WHERE scode = ? AND passwd = ? AND discd = 0";	
	} else {
		queryStr = "SELECT COUNT(*) CNT FROM tprofessor WHERE pcode = ? AND passwd = ? ";
	}
	
	res.db.query(queryStr, [user.scode, user.passwd], function(error, result){
		if(error) {
			console.log(error);
			res.json(null);
		} else {
			if(result[0].CNT > 0) {
				req.session.user = {code: user.scode};
				if(cLen == 9) {
					res.json("student");	
				} else {
					res.json("professor");
				}
			} else {
				res.json(null);	
			}
		}
	});
}