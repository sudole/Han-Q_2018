$(function() {
	// 과목 등록 페이지
	$("#btnSuj").on("click", function() {
		var subject = $("input[name=searchSuj]").val();

		if(confirm("[" + subject + "] 과목을 등록하시겠습니까?")) {
			saveSubject(subject);	
		}
	});
	
	//** 과목 조회 페이지
	$("#btnSearch").on("click", function() {
		searchSubject("", function(result) {
			if(result.list.length > 0) {
				$(".disCss").prop("disabled", false);
				$("input#btnSel.disCss").removeClass("ui-button-disabled ui-state-disabled")
				$("select#selSuj.disCss").next().removeClass("ui-selectmenu-disabled ui-state-disabled");
				$(".resOpt").remove();
				for (var i = 0; i < result.list.length; i++) {
					$("#selSuj").append("<option class='resOpt' value='" + result.list[i].sbid 
						+ "'>" + result.list[i].sbname + "</option>");
				}
			} else {
				alert("등록된 과목이 없습니다.");
			}
		});
	});

	$("#selSuj").selectmenu({
		change: function(event, ui){
			$("input[name=subject]").val($("#selSuj option:selected").text());
			$("input[name=sbid]").val($("#selSuj option:selected").val());
		}
	});
	//** selectSL Area
	$("#btnSujSearch").on("click", function() {
		searchSubject("", function(result) {
			if(result.list.length > 0) {
				$(".disCss2").prop("disabled", false);
				$("input#btnSel2.disCss2").removeClass("ui-button-disabled ui-state-disabled")
				$("select#sel2Suj.disCss2").next().removeClass("ui-selectmenu-disabled ui-state-disabled");
				$(".resOpt2").remove();
				for (var i = 0; i < result.list.length; i++) {
					$("#sel2Suj").append("<option class='resOpt2' value='" + result.list[i].sbid 
						+ "'>" + result.list[i].sbname + "</option>");
				}
			} else {
				alert("등록된 과목이 없습니다.");
			}			
		});
	});

	$("#sel2Suj").selectmenu({
		change: function(event, ui){
			$("input[name=subject2]").val($("#sel2Suj option:selected").text());
			$("input[name=sbid2]").val($("#sel2Suj option:selected").val());
		}
	});

	$("#btnLecSearch").on("click", function() {
		searchLecture({keyword:""}, function(result) {
			if(result.list.length > 0) {
				$(".disCss3").prop("disabled", false);
				$("select#selLec.disCss3").next().removeClass("ui-selectmenu-disabled ui-state-disabled");
				$(".resOpt3").remove();
				for (var i = 0; i < result.list.length; i++) {
					$("#selLec").append("<option class='resOpt3' value='" + result.list[i].lid 
						+ "'>" + result.list[i].lname + "</option>");
				}
			} else {
				alert("등록된 강좌가 없습니다.");
			}
		});
	});

	$("#selLec").selectmenu({
		change: function(event, ui) {
			$("input[name=lecture]").val($("#selLec option:selected").text());
			$("input[name=lid]").val($("#selLec option:selected").val());
		}
	});
	//**

	//** 강좌 등록 페이지
	$(".clkLec").on("click", function(){
		initLecAreaSubjectSelect();
	});

	$("#btnRegLec").on("click", function() {
		var lecture = {
			lname: $("input[name=lecture]").val(),
			sbid: $("select[name=lSubject] option:selected").val(),
			// professor: $("input[name=professor]").val(),
			semester: $("#semester1 option:selected").text() + $("#semester2 option:selected").text()
		}

		saveLecture(lecture);
	});
	//**
	//** 강좌 조회 페이지
	$(".clkLec2").on("click", function() {
		$("#searchLec").val("");
		$(".resli").remove();
	});
	//**
	//** 강좌 삭제 페이지
	$(".clkLec3").on("click", function() {
		$("#searchLec2").val("");
		$(".resli").remove();
	});
	//**
	//** 문제 등록 페이지
	$(".clkExm").on("click", function() {
		initExmAreaSubSelect("#etab1 #eSubject");
		$("#etab1 #eSubject").val("0").trigger("change");
	});

	$("#eSubject").on("change", function() {
		var sbid = $("#eSubject option:selected").val();
		initExmAreaLecSelect("#etab1 #eLecture", sbid);
		$("#etab1 #eLecture").val("0").trigger("change");
	});

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
	//**
	//** 문제 조회 페이지
	$(".clkExm2").on("click", function() {
		initExmAreaSubSelect("#etab2 #eSubject2");
		$("#etab2 #eSubject2").val("0").trigger("change");
		$(".resli ").remove();
	});

	$("#eSubject2").on("change", function() {
		var sbid = $("#eSubject2 option:selected").val();
		initExmAreaLecSelect("#etab2 #eLecture2", sbid);
		$("#etab2 #eLecture2").val("0").trigger("change");
	});

	$("#btnSearch").on("click", function() {
		var cond = {
			sbid: $("#eSubject2 option:selected").val(),
			lid: $("#eLecture2 option:selected").val()
		}
		if(cond.sbid == undefined || cond.sbid == "0") {
			alert("선택한 과목이 없습니다. \n 과목 선택 후 다시 시도해주세요.");
			return;
		}
		if(cond.lid == undefined || cond.lid == "0") {
			if(!confirm("강좌를 선택하지 않을 경우 과목에 해당하는 문제가 모두 보여집니다.\n 그래도 조회하시겠습니까?")) return;
			cond.lid = "";
		}
		searchExam(cond, function(result) {
			if(result !== null) {
				$(".resli").remove();
				for (var i = 0; i < result.length ; i++) {
					$("#examlist").append("<li class='resli ui-li-static ui-body-inherit ui-first-child ui-last-child' title='" + result[i].question + "'>" 
						+ result[i].question
						+ "</li>");
				}	
			}
		});
	});
	//**
	//** 문제 삭제 페이지
	$(".clkExm3").on("click", function() {
		initExmAreaSubSelect("#etab4 #eSubject3");
		$("#etab4 #eSubject3").val("0").trigger("change");
	});
	
	$("#eSubject3").on("change", function() {
		var sbid = $("#eSubject3 option:selected").val();
		initExmAreaLecSelect("#etab4 #eLecture3", sbid);
		$("#etab4 #eLecture3").val("0").trigger("change");
	});

	$("#btnSearch2").on("click", function() {
		var cond = {
			sbid: $("#eSubject3 option:selected").val()
		}
		if(cond.sbid == undefined || cond.sbid == "0") {
			alert("선택한 과목이 없습니다. \n 과목 선택 후 다시 시도해주세요.");
			return;
		}
		$(".resli").remove();
		searchExam(cond, function(result) {
			if(result !== null) {
				for (var i = 0; i < result.length ; i++) {
					$("#examlist2").append("<li class='resli ui-li-static ui-body-inherit ui-first-child ui-last-child'>" 
						+ "<textarea type='text' name='question' class='ui-input-text ui-shadow-inset ui-body-inherit ui-corner-all ui-textinput-autogrow'>" + result[i].question + "</textarea>"
						+ "<div class='ui-btn ui-input-btn ui-corner-all ui-shadow'>삭제하기"
						+ "<input type='button' onclick='onClickDeleteExm(" + result[i].reid + ");'></div>"
						+ "</li>");
				}	
			}
		});
	});
	//**
	//** 학생 등록페이지
	$(".clkStd").on("click", function() {
		initStdAreaSubSelect("#sttab1 #stSubject");
		$("#sttab1 select#stSubject").val("0").trigger("change");
	});

	$("#stSubject").on("change", function() {
		var sbid = $("#stSubject option:selected").val();
		initStdAreaLecSelect("#sttab1 #stLecture", sbid);
		$("select#stLecture").val("0").trigger("change");
	});

	$("#btnAddStd").on("click", function() {
		var student = {
			sname: $("input[name=stName]").val(),
			scode: $("input[name=stCode]").val(),
			lid: $("#stLecture option:selected").val()
		};

		if(student.scode.length != 9) {
			alert("학번은 9자리일 경우에만 정상적으로 동작합니다. 다시 시도해주세요.");
			return;
		}

		addStudent(student);
	});
	//** 학생 조회 페이지
	$("#btnShowStd").on("click", function() {
		var lid = $("#stLecture2 option:selected").val();

		if(lid == "" || lid == "0") {
			if(!confirm("강좌를 선택하지 않을 경우 전체 학생으로 조회가 됩니다.\n 계속하시겠습니까?")) {
				return;
			}
		}
		searchStudent(lid, function(result) {
			if(result == null) {
				alert("오류가 발생하였습니다. 잠시 후 다시 시도해주세요.");
			} else {
				$(".stdli").remove()
				for(var h=0;h <result.length;h++) {
					$("#stdlist").append("<li class='stdli ui-li-static ui-body-inherit ui-first-child ui-last-child'>" +result[h].sname 
						+ "(" + result[h].scode + "<span class='phone'>" + result[h].sphone + "</span>)</li>");
				}

				formatstr();
			}
		});
	});

	$(".clkStd2").on("click", function() {
		initStdAreaSubSelect("#sttab2 #stSubject2");
		$("#sttab2 #stSubject2").val("0").trigger("change");
	});

	$("#stSubject2").on("change", function() {
		var sbid = $("#stSubject2 option:selected").val();
		initStdAreaLecSelect("#sttab2 #stLecture2", sbid);
		$("#sttab2 #stLecture2").val("0").trigger("change");
	});
	//**
	//** 학생 삭제 페이지
	$("#btnShowStd2").on("click", function() {
		var lid = $("#stLecture3 option:selected").val();

		if(lid == "" || lid == "0") {
			if(!confirm("강좌를 선택하지 않을 경우 전체 학생으로 조회가 됩니다.\n 계속하시겠습니까?")) {
				return;
			}
		}
		searchStudent(lid, function(result) {
			if(result == null) {
				alert("오류가 발생하였습니다. 잠시 후 다시 시도해주세요.");
			} else {
				$(".stdli").remove()
				for(var h=0;h <result.length;h++) {
					$("#stdlist2").append(
						"<li class='stdli ui-li-static ui-body-inherit ui-first-child ui-last-child'>"
						+ "<div class='ui-input-text ui-body-inherit ui-corner-all ui-shadow-inset'>"
						+ "<input type='text' name='sname' value='" + result[h].sname + "(" + result[h].scode + ")' readonly>"
						+ "</div>"
						+ "<div class='ui-btn ui-input-btn ui-corner-all ui-shadow'>삭제하기"
						+ "<input type='button' onclick='onClickDeleteStd(" + result[h].sid + ");'></div>"
						+ "</li>");
				}
			}
		});
	});

	$(".clkStd3").on("click", function() {
		initStdAreaSubSelect("#sttab4 #stSubject3");
		$("#sttab4 #stSubject3").val("0").trigger("change");
	});

	$("#stSubject3").on("change", function() {
		var sbid = $("#stSubject3 option:selected").val();
		initStdAreaLecSelect("#sttab4 #stLecture3", sbid);
		$("#sttab4 #stLecture3").val("0").trigger("change");
	});
//**
	//** 시험 등록 페이지
	$("#tDate").datepicker({ dateFormat: "yy-mm-dd" });

	$(".clkTst").on("click", function() {
		initTstAreaSubSelect("#ttab1 #tSubject");
		$("#ttab1 #tSubject").val("0").trigger("change");
	});

	$("#tSubject").on("change", function() {
		var sbid = $("#tSubject option:selected").val();
		initTstAreaLecSelect("#ttab1 #tLecture", sbid); 
		$("#ttab1 #tLecture").val("0").trigger("change");
	});

	$("#btnBrExam").on("click", function() {
		bringExam();
	});

	$("#btnSave").on("click", function() {
		var test = {
			testname: $("input[name=testName]").val(),
			lid: $("#tLecture option:selected").val(),
			testdate: $("#tDate").val().replace(/-/gi,""),
			sttime : $("#stTime1 option:selected").val() + $("#stTime2 option:selected").val(),
			endtime: $("#endTime1 option:selected").val() + $("#endTime2 option:selected").val(),
			oxExam: [],
			blankExam: []
		};

		$("input[name=examChck]").each(function(item) {
			if($(this).is(":checked") == true) {
				if($(this).attr("eType") == "0") {
					test.oxExam.push({
						reid: $(this).attr("reid"),
						sn: $(this).siblings(".snp").find("#sn").val(), 
						point: $(this).siblings(".pntp").find("#point").val()
					});
				} else {
					test.blankExam.push({
						reid: $(this).attr("reid"), 
						sn: $(this).siblings(".snp").find("#sn").val(), 
						point: $(this).siblings(".pntp").find("#point").val()
					});
				}
			}
		});

		saveTest(test);
	});
	//**
	//** 시험 조회 페이지
	$("input[name=btnShowSub]").on("click", function() {
		getTestWithCondition({conType: 'subject'}, function(result) {
			var inSubject = [];
			$(".tItem").remove();
			for(var i=0; i<result.length; i++) {
				var appdStr = '';
				if(inSubject.length == 0) {
					inSubject.push(result[i].SBNAME);		// only check
					appdStr = "<li data-role='list-divider' role='heading' class='tItem ui-li-divider ui-bar-inherit ui-first-child ui-last-child'>" + result[i].SBNAME + "</li>"
				} else if(inSubject.indexOf(result[i].SBNAME) == -1) {
					inSubject.push(result[i].SBNAME);		// only check
					appdStr = "<li data-role='list-divider' role='heading' class='tItem ui-li-divider ui-bar-inherit ui-first-child ui-last-child'>" + result[i].SBNAME + "</li>"
				}
				appdStr += "<li class='tItem ui-li-static ui-body-inherit ui-first-child ui-last-child'>"
				+ "<h1>시험지명: " + result[i].TESTNAME + "</h1>"
				+ "<h2>시험날짜: <span class='date'>" + result[i].TESTDATE + "</span></h2>"
				+ "<h2>시작시간: <span class='time'>" + result[i].STTIME + "</span> 종료시간: <span class='time'>" + result[i].ENDTIME + "</span></h2>";

				if(result[i].FIN) {
					appdStr += "<div class='ui-btn ui-input-btn ui-corner-all ui-shadow ui-state-disabled'>"
					+ "출제 완료<input type='button' value='출제 완료' disabled></div>";
				} else {
					appdStr += "<div class='ui-btn ui-input-btn ui-corner-all ui-shadow'>"
					+ "출제하기<input type='button' onclick='finishTest(" + result[i].MKTID + ");' value='출제하기'></div>";
				}
				appdStr += "</li>";
				$("#testlist").append(appdStr);
			}

			formatstr();

		});
	});
	//**
	//** 시험 삭제 페이지
	$("input[name=btnShowSub2]").on("click", function() {
		getTestWithCondition({conType: 'subject'}, function(result) {
			var inSubject = [], testLen = 0;
			$(".tItem2").remove();
			for(var i=0; i<result.length; i++) {
				var appdStr = '';

				if(!result[i].FIN) {
					testLen++;
					if(inSubject.length == 0) {
						inSubject.push(result[i].SBNAME);		// only check
						appdStr = "<li data-role='list-divider' role='heading' class='tItem2 ui-li-divider ui-bar-inherit ui-first-child ui-last-child'>" + result[i].SBNAME + "</li>"
					} else if(inSubject.indexOf(result[i].SBNAME) == -1) {
						inSubject.push(result[i].SBNAME);		// only check
						appdStr = "<li data-role='list-divider' role='heading' class='tItem2 ui-li-divider ui-bar-inherit ui-first-child ui-last-child'>" + result[i].SBNAME + "</li>"
					}
					appdStr += "<li class='tItem2 ui-li-static ui-body-inherit ui-first-child ui-last-child'>"
					+ "<h1>시험지명: " + result[i].TESTNAME + "</h1>"
					+ "<h2>시험날짜: <span class='date'>" + result[i].TESTDATE + "</span></h2>"
					+ "<h2>시작시간: <span class='time'>" + result[i].STTIME + "</span> 종료시간: <span class='time'>" + result[i].ENDTIME + "</span></h2>";

					appdStr += "<div class='ui-btn ui-input-btn ui-corner-all ui-shadow'>"
					+ "삭제<input type='button' onclick='deleteTest(" + result[i].MKTID + ");' value='삭제'></div>";

					appdStr += "</li>";
					$("#testlist2").append(appdStr);				
				}
			}

			if(testLen == 0) {
				$("#testlist2").append("<li class='tItem2 ui-li-static ui-body-inherit ui-first-child ui-last-child' style='text-align:center;'>삭제할 항목이 없습니다.</li>")
			}
			formatstr();
		});
	});
	//**
});

function onKeydownRegSearchSuj(event, keyword) {
	$("#sujlist .resli").remove();
	if(event.keyCode != 13) return;

	if(keyword == "") {
		alert("입력된 내용이 없습니다. 다시 시도해주세요.");
		return;
	}
	searchSubject(keyword, function(result) {
		if(!result.flag) {
			alert("등록 가능합니다.");
			$("#btnSuj").prop("disabled", false);
		} else {
			alert("이미 등록되어 있습니다.");
		}
	});
}

function onKeydownSearchSuj(event, keyword) {
	$("#sujlist2 .resli").remove();
	if(event.keyCode != 13) return;

	searchSubject(keyword, function(result) {
		for (var i = 0; i < result.list.length ; i++) {
			$("#sujlist2").append("<li class='resli ui-li-static ui-body-inherit ui-first-child ui-last-child'>" +result.list[i].sbname + "</li>");
		}
	});
}

function onKeydownSearchSuj2(event, keyword) {
	$("#sujlist3 .resli").remove();
	if(event.keyCode != 13) return;

	searchSubject(keyword, function(result) { console.log(result);
		for (var i = 0; i < result.list.length ; i++) {
			$("#sujlist3").append("<li class='resli ui-li-static ui-body-inherit ui-first-child ui-last-child'>" 
				+ "<div class='sbnmp ui-input-text ui-body-inherit ui-corner-all ui-shadow-inset'>"
				+ "<input type='text' name='sbname' value='" + result.list[i].sbname  + "'>"
				+ "</div>"
				+ "<div class='ui-btn ui-input-btn ui-corner-all ui-shadow'>수정하기"
				+ "<input type='button' onclick='onClickUpdateSuj(this, " + result.list[i].sbid + ");'></div>"
				+ "</li>");
		}
	});
}

function onKeydownSearchSuj3(event, keyword) {
	$("#sujlist4 .resli").remove();
	if(event.keyCode != 13) return;

	searchSubject(keyword, function(result) { console.log(result);
		for (var i = 0; i < result.list.length ; i++) {
			$("#sujlist4").append("<li class='resli ui-li-static ui-body-inherit ui-first-child ui-last-child'>" 
				+ "<div class='sbnmp ui-input-text ui-body-inherit ui-corner-all ui-shadow-inset'>"
				+ "<input type='text' name='sbname' value='" + result.list[i].sbname  + "' readonly>"
				+ "</div>"
				+ "<div class='ui-btn ui-input-btn ui-corner-all ui-shadow'>삭제하기"
				+ "<input type='button' onclick='onClickDeleteSuj(" + result.list[i].sbid + ");'></div>"
				+ "</li>");
		}
	});
}

function onClickUpdateSuj(target, sbid) {
	var sbname = $(target).parent().parent().find("input[name=sbname]").val();

	$.ajax({
		url: 'updateSubject',
		type: 'POST',
		data: {sbname: sbname, sbid: sbid},
		success: function(result) {
			if(result !== null) {
				alert("완료되었습니다.");
				$("#sujlist3").html("");
			} else {
				alert("오류가 발생하였습니다. 잠시 후 다시 시도해주세요.");
			}
		}
	});
}

function onClickDeleteSuj(sbid) {
	if(!confirm("삭제 시 데이터를 다시는 복구할 수 없으며, \n 강좌, 시험 조회 시 문제가 발생할 수 있습니다.\n 그래도 삭제하시겠습니까?")) {
		return;
	}

	$.ajax({
		url: 'deleteSubject',
		type: 'POST',
		data: {sbid: sbid},
		success: function(result) {
			if(result !== null) {
				alert("완료되었습니다.");
				$("#sujlist4").html("");
			} else {
				alert("오류가 발생하였습니다. 잠시 후 다시 시도해주세요.");
			}
		}
	});
}

function onClickDeleteStd(sid) {
	if(!confirm("삭제 시 모든 강좌에서 확인할 수 없습니다.\n 그래도 삭제하시겠습니까?")) {
		return;
	}
	$.ajax({
		url: 'deleteStudent',
		type: 'POST',
		data: {sid: sid},
		success: function(result) {
			if(result !== null) {
				alert("완료되었습니다.");
				$("#stdlist2").html("");
			} else {
				alert("오류가 발생하였습니다. 잠시 후 다시 시도해주세요.");
			}
		}
	});
}

function searchSubject(keyword, callback) {
	$.ajax({
		url: "searchSubject",
		type: "GET",
		data: {keyword: keyword},
		success: function(result) {
			if(result == null) {
				alert("오류가 발생하였습니다. 잠시 후 다시 시도해주세요.");
				return;
			}
			callback(result);
		}
	});
}

function saveSubject(data) {
	$.ajax({
		url: 'saveSubject',
		type: 'POST',
		data: {subject: data},
		success: function(result) {
			if(result == "OK") {
				alert("등록 되었습니다.");
				$("#searchSuj").val("");
				$.mobile.changePage("#main");
			} else {
				alert("등록 되지 않았습니다. 잠시후 다시 시도해주세요.");
			}
		}
	});
}

function searchLecture(data, callback) {
	$.ajax({
		url: "searchLecture",
		type: "GET",
		data: data,
		success: function(result) {
			if(result == null) {
				alert("오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
				return;
			}
			callback(result);
		}
	})
}

function onKeydownSearchLec(event, keyword) {
	if(event.keyCode != 13) return;

	searchLecture({keyword:keyword}, function(result) {
		$(".resli").remove();
		for (var i = 0; i < result.list.length ; i++) {
			$("#leclist").append("<li class='resli ui-li-static ui-body-inherit ui-first-child ui-last-child'>" +result.list[i].lname + "</li>");
		}
	});
}

function onKeydownDelSearchLec(event, keyword) {
	if(event.keyCode != 13) return;

	searchLecture({keyword:keyword}, function(result) {
		$(".resli").remove();
		for (var i = 0; i < result.list.length ; i++) {
			$("#leclist2").append("<li class='resli ui-li-static ui-body-inherit ui-first-child ui-last-child'>"
				+ "<div class='ui-input-text ui-body-inherit ui-corner-all ui-shadow-inset'>"
				+ "<input type='text' name='lname' value='" + result.list[i].lname  + "' readonly>"
				+ "</div>"
				+ "<div class='ui-btn ui-input-btn ui-corner-all ui-shadow'>삭제하기"
				+ "<input type='button' onclick='onClickDeleteLec(" + result.list[i].lid + ");'></div>"
				+ "</li>");
		}
	});
}

function initLecAreaSubjectSelect() {
	searchSubject("", function(result) {
		if(result.list.length > 0) {
			$(".lSubOpt").remove();
			for(var k=0; k < result.list.length; k++) {
				$("#ltab1 #lSubject").append(
					"<option class='lSubOpt' value='" + result.list[k].sbid + "'>"
					+ result.list[k].sbname + "</option>"
					);
			}
		}
		$("#ltab1 #lSubject").val("0").trigger("change");
	});
}

function saveLecture(data) {
	$.ajax({
		url: 'saveLecture',
		type: 'POST',
		data: {lecture: data},
		success: function(result) {
			if(result == "OK") {
				alert("등록 되었습니다.");
				$("input[name=lecture]").val("");
			} else {
				alert("등록 되지 않았습니다. 잠시후 다시 시도해주세요.");
			}
		}
	});  
}

function initExmAreaSubSelect(_target) {
	searchSubject("", function(result) {
		if(result.list.length > 0) {
			$(".eSubOpt").remove();
			for(var k=0; k < result.list.length; k++) {
				$(_target).append(
					"<option class='eSubOpt' value='" + result.list[k].sbid + "'>"
					+ result.list[k].sbname + "</option>"
					);
			}
		}
	});
}

function initExmAreaLecSelect(_target, sbid) {
	searchLecture({keyword:"",sbid:sbid}, function(result) {
		if(result.list.length > 0) {
			$(".eLecOpt").remove();
			for(var l=0; l < result.list.length; l++) {
				$(_target).append(
					"<option class='eLecOpt' value='" + result.list[l].lid + "'>"
					+ result.list[l].lname + "</option>"
					);
			}
		}
	});
}

function initStdAreaSubSelect(_target) {
	searchSubject("", function(result) {
		if(result.list.length > 0) {
			$(".stSubOpt").remove();
			for(var h=0;h<result.list.length;h++) {
				$(_target).append(
					"<option class='stSubOpt' value='" + result.list[h].sbid + "''>"
					+result.list[h].sbname + "</option>"
					);
			}
		}
	});
}

function initStdAreaLecSelect(_target, sbid) {
	searchLecture({keyword:"",sbid:sbid}, function(result) {
		$(".stLecOpt").remove();
		if(result.list.length > 0) {
			for(var l=0; l < result.list.length; l++) {
				$(_target).append(
					"<option class='stLecOpt' value='" + result.list[l].lid + "'>"
					+ result.list[l].lname + "</option>"
					);
			}
		}
	});	
}

function registExam() {
	var exam = {
		sbid: $("#eSubject option:selected").val(),
		lid: $("#eLecture option:selected").val(),
		etype: $("input[name=examType]:checked").val(),
		question: $("#question").val(),
		comment: $("#comment").val(),
		answer: []
	}

	$(".ansGrp").each(function(idx) {
		exam.answer.push($(this).val());
	});

	$.ajax({
		url: 'saveExam',
		type: 'POST',
		data: {exam: exam},
		success: function(result) {
			if(result == "OK") {
				alert("정상적으로 등록되었습니다.");
				$("#question").val("");
				$("#comment").val("");
				$(".ansGrp").eq(0).val("");
				$(".ansGrp:not(:eq(0))").parent().remove();
				$(".ansGrp:not(:eq(0))").remove();
			} else {
				alert("오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
			}
		}
	});
}

function searchExam(data, callback) {
	$.ajax({
		url: 'searchExam',
		type: 'POST',
		data: data,
		success: function(result) {
			callback(result);
		}
	});
}

function addStudent(data) {
	$.ajax({
		url: 'addStudent',
		type: 'POST',
		data: {student: data},
		success: function(result) {
			if(result == "OK") {
				alert("등록되었습니다.");
				$("input[name=stName]").val("");
				$("input[name=stCode]").val("");
				$("select#stSubject").val("0").prop("selected", "selected");
			} else {
				alert("오류가 발생하였습니다. 잠시 후 다시 시도해주세요.");
			}
		}
	});
}

function searchStudent(lid, callback) {
	$.ajax({
		url: 'searchStudent',
		type: 'POST',
		data: {lid: lid},
		success: function(result) {
			callback(result);
		}
	});
}

function initTstAreaSubSelect(_target) {
	searchSubject("", function(result) {
		if(result.list.length > 0) {
			$(".tSubOpt").remove();
			for(var h=0;h<result.list.length;h++) {
				$(_target).append(
					"<option class='tSubOpt' value='" + result.list[h].sbid + "''>"
					+result.list[h].sbname + "</option>"
					);
			}
		}
	});
}

function initTstAreaLecSelect(_target, sbid) {
	searchLecture({keyword:"",sbid:sbid}, function(result) {
		if(result.list.length > 0) {
			$(".tLecOpt").remove();
			for(var l=0; l < result.list.length; l++) {
				$(_target).append(
					"<option class='tLecOpt' value='" + result.list[l].lid + "'>"
					+ result.list[l].lname + "</option>"
					);
			}
		}
	});	
}

function bringExam() {
	var sbid = $("#tSubject option:selected").val();
	var lid = $("#tLecture option:selected").val();

	if(sbid == undefined || sbid == "0") {
		alert("과목이 선택되지 않았습니다. 선택 후 다시 시도해주세요.");
		return;
	}
	if(lid == undefined || lid == "0") {
		if(!confirm("강좌가 선택되지 않을 경우 선택된 과목에 해당하는 문제가 모두 보여집니다. \n그래도 조회하시겠습니까?")) return;
		lid = "";
	}
	$(".resli").remove();
	$.ajax({
		url: 'searchExam',
		type: 'POST',
		data: {sbid: sbid, lid: lid},
		success: function(result) {
			if(result == null) {
				alert("오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
			} else {
				var appendStr = "";
				for (var i = 0; i < result.length; i++) {
					appendStr = "<li class='resli ui-li-static ui-body-inherit ui-first-child ui-last-child'>" 
					+ "<input type='checkbox' name='examChck' reid='" + result[i].reid + "' eType='" + result[i].type + "' data-mini='true' readonly> [" + (i+1) + "]&nbsp;&nbsp;<br>"
					+ "<div class='ui-field-contain'><label for='type'>유형</label>"
					+ "<div class='ui-input-text ui-body-inherit ui-corner-all ui-shadow-inset'><input id='type' class='eType' type='text' value='" + result[i].type + "' readonly></div></div>"
					+ "<div class='ui-field-contain'><label for='quest'>문제</label>"
					+ "<textarea id='quest' class='ui-input-text ui-shadow-inset ui-body-inherit ui-corner-all ui-textinput-autogrow' readonly>" + result[i].question + "</textarea></div>"
					+ "<div class='ui-input-text ui-body-inherit ui-corner-all ui-shadow-inset'><input type='text' value='(" + result[i].comment + ")'></div>"
					+ "<div class='ui-field-contain'><label for='ans'>답</label>"
					+ "<div class='ui-input-text ui-body-inherit ui-corner-all ui-shadow-inset'><input class='ans' name='ans' type='text' value='" + result[i].answer1 + "' readonly>";
					if(result[i].type == "1") {
						for(var j = 2; j <= 5; j ++) {
							var field = ("answer" + j);
							if(result[i][field] !== undefined && result[i][field] !== null)
								appendStr += "<input class='ans' name='ans' type='text' value='" + result[i][field] + "' readonly>";	
						}
					}
					appendStr += "</div></div><div class='snp ui-field-contain'><label for='sn'>순서</label>"
					+ "<div class='ui-input-text ui-body-inherit ui-corner-all ui-shadow-inset'><input type='text' value='' name='sn' id='sn'></div></div>"
					+ "<div class='pntp ui-field-contain'><label for='point'>배점</label>"
					+ "<div class='ui-input-text ui-body-inherit ui-corner-all ui-shadow-inset'><input type='text' value='' name='point' id='point'></div></div>"					
					+ "</li>";
					$("#ExamArea").append(appendStr);
				}
				formatstr();
			}
		}
	});	
}

function onClickDeleteExm(reid) {
	if(!confirm("삭제 시 다시는 복구할 수 없습니다.\n그래도 삭제하시겠습니까?")) return;
	$.ajax({
		url: 'deleteExam',
		type: 'POST',
		data: {reid: reid},
		success: function(result) {
			if(result == "OK") {
				alert("정상적으로 처리되었습니다.");
				$("#btnSearch2").trigger("click");
			} else {
				alert("오류가 발생하였습니다. \n잠시 후 다시 시도해주세요.");
			}
		}
	});
}

function saveTest(data) {
	$.ajax({
		url: 'saveTest',
		type: 'POST',
		data: {test: data},
		success: function(result) {
			if(result == "OK") {
				alert("정상적으로 처리되었습니다.");
				$("#ttab1 .resli").remove();
				$("input[name=testName]").val("");
			} else {
				alert("오류가 발생하였습니다. 잠시후 다시 시도해주세요.")
			}
		}
	});
}

// function onChangeChckbox(_this) {
// 	if($(_this).is(":checked")) {
// 		var snum = $(".chckSn").length;
// 		$(_this).addClass("chckSn");
// 		$(_this).siblings(".snp").find("#sn").val(snum + 1);
// 	} else {
// 		$(_this).siblings(".snp").find("#sn").val("");
// 		$(_this).removeClass("chckSn");
// 	}
// }

function getTestWithCondition(data, callback) {
	$.ajax({
		url: 'getTestWithCondition',
		type: 'POST',
		data: data,
		success: function(result) {
			if(result !== null) {
				callback(result);
			}
		}
	});
}

function finishTest(mktid) {
	$.ajax({
		url:"finishTest",
		type: 'POST',
		data: {mktid: mktid},
		success: function(result) {
			if(result == "OK") {
				alert("완료되었습니다.");
				$(".tt2btn").trigger("click");
			} else {
				alert("오류가 발생하였습니다. 잠시 후 다시 시도해주세요.");
			}
		}
	});
}

function deleteTest(mktid) {
	$.ajax({
		url:'deleteTest',
		type: 'POST',
		data : {mktid:mktid},
		success:function(result) {
			if(result == "OK") {
				alert("완료되었습니다.");
				$(".tt2btn2").trigger("click");
			} else {
				alert("오류가 발생하였습니다. 잠시 후 다시 시도해주세요.");
			}
		}
	});
}

function moveUpdateTestPage(mktid) {
	getTestWithCondition({mktid:mktid}, function(result) {
		$(".lkupdate").trigger("click");
		console.log(result);
		$("#ttab3").html("");
		$("#testUnit2").tmpl(result).appendTo("#ttab3");
		$("#tDate2").datepicker({ dateFormat: "yy-mm-dd" });
	});
}

function updateTestBtnClick(mktid) {
	var test = {
		mktid: mktid,
		testname: $("#ttab3 input[name=testName]").val(),
		testdate: $("#ttab3 input[name=tDate2]").val().replace(/-/gi,""),
		sttime: $("#ttab3 #stTime1 option:selected").val() + 
		$("#ttab3 #stTime2 option:selected").val(),
		endtime: $("#ttab3 #endTime1 option:selected").val() +
		$("#ttab3 #endTime2 option:selected").val(),
		exams: []	
	};

	$(".exms").each(function() {
		var exam = {};
		exam.eid = $(this).attr("eid");
		exam.eType = $(this).attr("etype");
		exam.point = $(this).find("input[name=point]").val();
		exam.sn = $(this).find("input[name=sn]").val();

		test.exams.push(exam);
	});
	
	$.ajax({
		url: 'updateTestPaper',
		type: 'POST',
		data: {testpaper: test},
		success:function(result) {
			if(result !== null) {
				alert("완료되었습니다.");
				$("#ttab3").html("");
				$("#ttab2 #testlist").html("");
			} else {
				alert("오류가 발생하였습니다. 잠시 후 다시 시도해주세요.");
			}
		}
	});
}

function onClickDeleteLec(lid) {
	if(!confirm("강의 삭제 시 연결된 문제, 시험 정보 확인이 불가능합니다.\n그래도 삭제하시겠습니까?")) return;

	$.ajax({
		url: "deleteLecture",
		type: "POST",
		data: {lid:lid},
		success: function(result) {
			if(result == "OK") {
				alert("완료되었습니다.");
				$("#searchLec").trigger("onkeydown");
			} else alert("오류가 발생하였습니다. 잠시 후 다시 시도해주세요.");
		}
	});
}

//** format
function formatstr() {
	$(".eType").each(function() {
		if($(this).val() == "0") $(this).val("OX형");
		else $(this).val("괄호형");
	});

	$(".date").each(function() {
		var date = $(this).text();
		if(date.indexOf("-") < 0)
			$(this).text(date.substring(0,4) + "-" + date.substring(4,6) + "-" + date.substring(6,8));
	});

	$(".time").each(function() {
		var time = $(this).text();
		if(time.indexOf(":") < 0)
			$(this).text(time.substring(0,2) + ":" + time.substring(2,4));
	});

	$(".phone").each(function() {
		var phone = $(this).text();
		if(phone == "null" || phone == "") $(this).text("");
		else {
			if(phone.length == 11) {
				phone = phone.substring(0,3) + "-" + phone.substring(3,7) + "-" + phone.substring(7,11);
			} else if(phone.length == 10 && phone.substring(0,2) == "02") {
				phone = phone.substring(0,2) + "-" + phone.substring(2,6) + "-" + phone.substring(6,10);
			} else if(phone.length == 10) {
				phone.phone.substring(0,3) + "-" + phone.substring(3,6) + "-" + phone.substring(6,10);
			}

			$(this).text(", " + phone);		
		}
	});
}