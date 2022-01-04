$(function() {
	$("#btnRegEx").on("click", function() {
		registExam();
	});

	$("#btnplus").on("click", function() {
		var ansCnt = $(".ansGrp").length;

		if(ansCnt == 5) {
			alert("정답은 최대 5개까지 등록 가능합니다.");
			return;
		}

		$("#answer"+ansCnt).parent().after("<div class='ui-input-text ui-body-inherit ui-corner-all ui-shadow-inset'><input type='text' id='answer"+(ansCnt+1)+"' class='ansGrp'></div>");
	});
})

function registExam() {
	var exam = {
		sbid: $("#eSubject").attr("sbid"),
		lid: 0,
		etype: $("input[name=examType]:checked").val(),
		question: $("#question").val(),
		comment: $("#comment").val(),
		answer: []
	}

	$(".ansGrp").each(function(idx) {
		exam.answer.push($(this).val());
	});
	saveExam(exam);
}

function saveExam(data) {
	$.ajax({
		url: 'saveExam',
		type: 'POST',
		data: {exam: data},
		success: function(result) {
			if(result == "OK") {
				window.location.href = "center.html";
			} else {
				alert("오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
			}
		}
	})
}