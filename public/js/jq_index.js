$(function() {
	// Initialize
	$("input[name=scode]").focus();
	$("#btnLogin").on("click", function() {
		reqLogin();		
	});
	// Enter Key Event
	Key13Event("input[name=passwd]", reqLogin);
});

function reqLogin() {
	var user = {
		scode: $("input[name=scode]").val(),
		passwd: $("input[name=passwd]").val()
	};

	$.ajax({
		url: 'reqLogin',
		type: 'POST',
		data: {user: user},
		success: function(result) {
			console.log(result);
			if(result == "professor") {
				// $.mobile.changePage("center.html");
				window.location.href = "center_2.html";
			} else if (result == "student") {
				window.location.href = "centerStudent.html";
			} else {
				alert("등록된 정보가 없습니다.");
			}
		}
	});
}