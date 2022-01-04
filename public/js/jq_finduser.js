$(function() {
	$("#btnIdFind").on("click", function() {
		findUser('ID');
	});

	$("#btnPwFind").on("click", function() {
		findUser('PW');
	});
});

function findUser (purpose) {
	var user = {
		sname: $("input[name=fName]").val(),
		scode: $("input[name=fCode]").val(),
		sphone: $("input[name=fPhone]").val(),
		purpose: purpose
	};
	if(user.sname == "" || user.scode == "") {
		alert("이름, 학번을 모두 입력해주세요.");
		return;
	}
	$.ajax({
		url: 'findUser',
		type: 'POST',
		data: {user: user},
		success: function(result) {
			if(result != null) {
				if(result.length == 0) {
					alert("등록된 정보가 없습니다. 등록 후 다시 시도해주세요.");
					return;
				}
				if(user.purpose == 'ID') {
					alert("ID : " + result[0].userid);
				} else {
					alert("PW : " + result[0].passwd);
				}
			}
			else
				alert("오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
		}
	});
}