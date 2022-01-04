$(function() {
	$("input[name=sName]").focus();
	
	Key13Event("input[name=sCode]", searchUser);
	Key13Event("input[name=sName]", searchUser);

	$("#btnSearch").on("click", function() {
		searchUser();
	});

	$("#btnReg").on("click", function() {
		var nUser = {
			sid: $("input[name=sid]").val(),
			sname: $("input[name=sName]").val(),
			scode: $("input[name=sCode]").val(),
			userid: $("input[name=userId]").val(),
			passwd: $("input[name=passwd]").val(),
			sphone: $("input[name=sPhone]").val()
		};
		updateUser(nUser);
	});
});

function updateUser(data) {
	$.ajax({
		url: "updateUser",
		type: "POST",
		data: {user: data},
		success: function(result) {
			if(result == "OK") {
				alert("등록되었습니다.");
				window.location.href = "index.html";
			} else {
				alert("등록에 실패하였습니다.");
			}
		}
	});
}

function searchUser() {
	var user = {
		name: $("input[name=sName]").val(),
		code: $("input[name=sCode]").val()
	};

	if(user.name == "" || user.code == "") {
		alert("이름과 학번을 모두 입력해주세요.");
		$(".disApGrp").prop("disabled", true);
		$("input.disApGrp").parent().addClass("ui-state-disabled");
		$("input.disApGrp").val("");
		return;
	}

	$.ajax({
		url: "searchUser", 
		type: 'POST',
		data: {user:user},
		success: function(result){
			if(result.length > 0) {
				$(".disApGrp").prop("disabled", false);
				$(".disApGrp").parent().removeClass("ui-state-disabled");
				setUser(result[0]);
			}
			else alert('등록된 정보가 없습니다.');
		}
	});
}

function setUser(data) {
	$("input[name=sName]").val(data.sname);
	$("input[name=sCode]").val(data.scode);
	$("input[name=userId]").val(data.userid);
	$("input[name=passwd]").val(data.passwd);
	$("input[name=sPhone]").val(data.sphone);
	$("input[name=sid]").val(data.sid);
}