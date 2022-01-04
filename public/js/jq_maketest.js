$(function() {

	$("#tDate").datepicker({ dateformat: "yy-mm-dd" }).val()
	

	$("#btnBrExam").on("click", function() {
		bringExam();
	});

	$(".chcks").on("click", function() {
		alert("CLick");
		$("#exCnt").text($(".chcks").length);
	});
})

function bringExam() {
	var sbid = $("input[name=subject]").attr("sbid");

	$.ajax({
		url: 'bringExam',
		type: 'POST',
		data: {sbid: sbid},
		success: function(result) {
			if(result == null) {
				alert("오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
			} else {
				var appendStr = "";
				for (var i = 0; i < result.length; i++) {
					appendStr += "<tr id='ex" + result[i].reid + "'>" 
					+ "<td><input type='checkbox' class='chcks' reid='"+result[i].reid+"'></td>"
					+ "<td class='eType'>" + result[i].type + "</td>"
					+ "<td>" + result[i].question + "</td>"
					+ "<td>" + result[i].answer1 + "</td>"
					+ "</tr>";
				}
				console.log(result);
				console.log(appendStr);
				$("#examArea tbody").append(appendStr);
				formatstr();
			}
		}
	});	
}

function formatstr() {
	$(".eType").each(function() {
		if($(this).text() == "0") $(this).text("OX형");
		else $(this).text("괄호형");
	});
}