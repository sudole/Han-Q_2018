var testpaper = [];
var nowIndex = -1;
var stdAnswer = [];
var student;
var today = getToday(new Date());

$(function() {
	student=JSON.parse($("input[name=student]").val());
	initLectureList();

	$(".btnSt").on("click", function() {
		var mktid = $(this).attr("mktid");
		checkStartTestTime(mktid, function(result) {
			if(!result.flag) {
				alert("시험 시간이 아닙니다. 시간을 확인 후 다시 시도해주세요.\n(시험일정:"+formatDate(result.testdate)+" "+
					formatTime(result.sttime)+"~"+formatTime(result.endtime)+")");
				return;
			} 

			$.ajax({
				url: 'getTestExam',
				type: 'POST',
				data: {mktid: mktid},
				success:function(result) {
					if(result !== null) {
						testpaper = result;
						nowIndex = 0;
						stdAnswer = new Array(testpaper.length);
						$(".btnSt").after("<div data-role='content' class='testPaper'>"
							+ "<header>"
						// + "<button id='btnBeEx' style='float:left;'><</button>"
						// + "<button id='btnNeEx' style='float:right;'>></button>"
						+ "</header>"
						+ "<center>"
						+ "<img src='images/btn-leftword.png' width='100' onclick='clickBeforeBtn();' style='border: 6px solid #b7cdb8;border-radius: 1em;padding: 2px;float:left;' alt='이전문제'>"
						+ "<img src='images/btn-rightword.png' width='100' onclick='clickNextBtn();' style='border: 6px solid #b7cdb8;border-radius: 1em;padding: 2px;float:right;' alt='다음문제'>"
						+ "<div style='clear:both;padding-top:2%;padding-bottom: 2%;border: 4px solid #b7cdb8;border-radius: 1em;' id='examArea'>"
						+ "<p>Q.<span id='index'>" + 1 + "</span> <span id='question'>" + testpaper[0].question + "</span></p>"
						+ "<p>( <span id='comment'>" + testpaper[0].comment + "</span> )</p>"
						+ "<input name='stAnswer' onfocusout='checkanswerbox(this);' onkeydown='onKeyDownAnswerBox(event, this);' index='" + 0 + "' style='width:86%;'>"
						+ "</div>"
						+ "<input type='hidden' name='asid' value=''>"
						+ "<button class='ui-btn ui-shadow ui-corner-left' onclick='saveAnswer(this);'>확인</button>"
						+ "<button class='btnSendAnswer ui-btn ui-shadow ui-corner-right' disabled='disabled' onclick='sendAnswer();'>답안제출</button>"
						+ "</div></center>");
						$(".testPaper").append('<footer data-role="footer" style="font-size:9px;"><div>Icons made by <a href="https://www.flaticon.com/authors/dave-gandy" title="Dave Gandy">Dave Gandy</a> from <a href="https://www.flaticon.com/" 			    title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" 			    title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div></footer>');
						checkTestTime(mktid, 0);
					} else {
						alert("오류가 발생하였습니다. 잠시 후 다시 시도해주세요.");
					}
				}
			});
		});
	});

	$(".btnEn").on("click", function() {
		var mktid = $(this).attr("mktid");

		$.ajax({
			url: 'getStudentTestResult',
			type: 'POST',
			data: {mktid: mktid, sid: student.uid},
			success: function(result) {
				if(result != null) {
					var testpaper = result.testpaper;
					var fontColor = "", tPoint = 0, resultStr = "";

					for(var i = 0; i < testpaper.length; i++) {
						if(testpaper[i].spoint == testpaper[i].point) {
							fontColor = "blue";
						} else fontColor = "red";

						tPoint += testpaper[i].point;
						resultStr += "<p>Q." + (i+1) + " " + testpaper[i].question + "</p>"
						+ "<p style='color:" + fontColor + ";'>작성한 답 Ð " + testpaper[i].stanswer + "</p>"
						+ "<p><b>정답 Ð " + (testpaper[i].answer).replace(/(\/\/\/\/|\/\/\/|\/\/)/gi,"") + "</b></p>";
					}



					var resultPaper = "<p> 점수 : " + result.scorecard[0].score + "점 / 총 " + tPoint + "점 </p><hr>" 
					+ resultStr + "<hr><a href='CenterStudent.html'>닫기</a>";
					$(".btnEn").after(resultPaper);
				} else {
					alert("오류가 발생하였습니다. 잠시 후 다시 시도해주세요.");
				}
			}
		});
	});
});

function initLectureList() {
	var lectures = JSON.parse($("input[name=lectures]").val());

	for(var i=0; i<lectures.length;i++) {
		$("#leclist").append("<li class='ui-btn ui-btn-icon-right ui-icon-carat-r'>\n"
			+ "<a href='#lec" + i + "' class='ui-btn ui-btn-icon-right ui-icon-carat-r'>"
			+ "<button id='lecbtn" + i + "' class='ui-btn ui-shadow ui-corner-all'><p>"
			+ "<b id='" + i + "tflag'></b>"
			+ lectures[i].TESTNAME
			+ "</p>"
			+ "<p> 시험일정 <span class='date'>"
			+ lectures[i].TESTDATE + "</span> "
			+ "<span class='time'>" + lectures[i].STTIME + "</span> ~ <span class='time'>" + lectures[i].ENDTIME
			+ "</span></p></button>"
			+ "</a>"
			+ "</li>");

		var afterStr = "<div data-role='page' id='lec" + i + "'>"
		+ "<header data-role='header'>"
		+ "<p>&nbsp; Ð 시험지명: " + lectures[i].TESTNAME + "</p>"
		+ "<p>&nbsp; Ð 과목명: " + lectures[i].SBNAME + "</p>"
		+ "<p>&nbsp; Ð 강좌명: " + lectures[i].LNAME + "</p>"
		+ "<p>&nbsp; Ð 이름: " + student.sname + " 학번: " + student.scode + "</p>"
		+ "</header>"
		+ "<div data-role='content'>";
		if(lectures[i].TLAG == -1) {
			if(lectures[i].TESTDATE < today.replace(/-/gi,"")) {
				$("button#lecbtn"+i).css("background-color","#CFCFCF");
				afterStr += "<center><b>시험 일정이 종료되었습니다.</b>"
				+ "<p><span class='date'>"
				+ lectures[i].TESTDATE + "</span> "
				+ "<span class='time'>" + lectures[i].STTIME + "</span> ~ <span class='time'>" + lectures[i].ENDTIME
				+ "</span></p></center>";
			}
			else {
				$("button#lecbtn"+i).css("background-color","#106510").css("color","white");
				afterStr += "<button class='btnSt' mktid='" + lectures[i].MKTID + "'>시험시작</button>";
			}
		} else {
			afterStr += "<center><h2>응&nbsp;&nbsp;시&nbsp;&nbsp;완&nbsp;&nbsp;료&nbsp;&nbsp;</h2></center>"
			+ "<button class='btnEn' mktid='" + lectures[i].MKTID + "'>결과보기</button>";
			$("#"+i+"tflag").text("[완료]  ");
		}
		afterStr += "</div></div>";
		$("#lecsArea").after(afterStr);
	}

	formatStr();	
}

function clickBeforeBtn() { console.log(testpaper.length -1, nowIndex);
	if(nowIndex < 1) return;
	var stdAns = $("input[name=stAnswer]").val();
	var asid = $("input[name=asid]").val();
	if(stdAns != "") {
		stdAnswer[nowIndex] = {asid:asid, stanswer: stdAns};
	}
	var beforeIdx = nowIndex-1;
	var beforeExam = testpaper[beforeIdx];
	$("span#index").text(beforeIdx + 1);
	$("span#question").text(beforeExam.question.replace(/\(\)/gi,"(    )"));
	$("span#comment").text(beforeExam.comment);
	nowIndex = beforeIdx;

	if(stdAnswer[nowIndex] != undefined && stdAnswer[nowIndex].stanswer != undefined) {
		$("input[name=stAnswer]").val(stdAnswer[nowIndex].stanswer);
		$("input[name=asid]").val(stdAnswer[nowIndex].asid);
	} else {
		$("input[name=stAnswer]").val("");
		$("input[name=asid]").val("");
	}

	answerCheck();
}

function clickNextBtn() { console.log(testpaper.length -1, nowIndex);
	if(nowIndex >= testpaper.length - 1) return;
	var stdAns = $("input[name=stAnswer]").val();
	var asid = $("input[name=asid]").val();
	if(stdAns != "") {
		stdAnswer[nowIndex] = {asid:asid, stanswer: stdAns};
	}
	var nextIdx = nowIndex+1;
	var nextExam = testpaper[nextIdx];
	nowIndex = nextIdx;

	$("span#index").text(nextIdx + 1);
	$("span#question").text(nextExam.question.replace(/\(\)/gi,"(    )"));
	$("span#comment").text(nextExam.comment);

	if(stdAnswer[nowIndex] != undefined && stdAnswer[nowIndex].stanswer != undefined) {
		$("input[name=stAnswer]").val(stdAnswer[nowIndex].stanswer);
		$("input[name=asid]").val(stdAnswer[nowIndex].asid);		
	} else {
		$("input[name=stAnswer]").val("");
		$("input[name=asid]").val("");
	}

	answerCheck();
}

function checkanswerbox(target) {
	stdAnswer[nowIndex] = {asid: $(target).parent().siblings("input[name=asid]").val(), stanswer: $(target).val()};
	answerCheck();
}

function answerCheck() {
	var chckFlag = true;
	for(var k=0; k<stdAnswer.length; k++) {
		if(stdAnswer[k] == undefined) {
			chckFlag = false;
			break;
		}
		if(stdAnswer[k].stanswer == undefined || stdAnswer[k].stanswer == "") {
			chckFlag = false; 
			break;
		}

	}

	if(chckFlag) {
		$(".btnSendAnswer").attr("disabled", false);
	} else $(".btnSendAnswer").attr("disabled", true);
}

function sendAnswer() {
	var totalPoint = 0, stdPoint = 0;
	var sAnsFlag = [], stAnswers = [];
	var examStr = "";
	var saveData = {};
	var stGrade = {sid:student.uid,score:0,rank:0,mktid:testpaper[0].mktid};

	for(var i=0; i<testpaper.length;i++) {
		var chckAns = false;
		var answer = "", fontColor = "";
		var tmpanswer = {point:0};
		// 답 체크
		for(var a=1; a<=5; a++) {
			var field = "answer" + a;
			if(testpaper[i][field] !== undefined && testpaper[i][field] !== null) {
				if(stdAnswer[i] != undefined && testpaper[i][field] == stdAnswer[i].stanswer) {
					chckAns = true;
				}
				if(answer !== "") answer += "/";
				answer += testpaper[i][field];
			}
		}
		// 정답인 경우 처리
		if(chckAns) {
			stdPoint += testpaper[i].point;
			fontColor = "blue";
			tmpanswer.point = testpaper[i].point;
		} else fontColor = "red";

		// 점수 계산
		totalPoint += testpaper[i].point;
		sAnsFlag.push(chckAns);
		// 화면에 표시할 내용 정리 
		examStr += "<p>Q." + (i+1) + " " + testpaper[i].question + "</p>"
		+ "<p style='color:" + fontColor + ";'>작성한 답 Ð " + stdAnswer[i].stanswer + "</p>"
		+ "<p><b>정답 Ð " + answer + "</b></p>";

		tmpanswer.question = testpaper[i].question;
		tmpanswer.stanswer = stdAnswer[i].stanswer;
		tmpanswer.fintid = testpaper[i].fintid;
		tmpanswer.sid = student.uid;
		tmpanswer.asid = stdAnswer[i].asid;
		stAnswers.push(tmpanswer);
	}
	// 저장할 데이터 정리
	stGrade.score = stdPoint;
	saveData.stGrade = stGrade;
	saveData.stAnswers = stAnswers;

	saveStudentTestResult(saveData, function(result) {
		if(result == "OK") {
			$(".btnSt").remove();

			var resultPaper = "<p> 점수 : " + stdPoint + "점 / 총 " + totalPoint + "점 </p><hr>" 
			+ examStr + "<hr><a href='centerStudent.html'>닫기</a>";
			console.log(resultPaper);
			$("div.testPaper").html(resultPaper);
		} else {
			alert("오류가 발생하였습니다. 잠시 후 다시 시도해주세요.\n( 페이지를 벗어날 경우 데이터가 사라집니다. )");
		}
	});
}

function saveAnswer(target) {
	var asid = $(target).siblings("input[name=asid]").val();
	var data = {
		fintid: testpaper[nowIndex].fintid,
		sid: student.uid,
		question: testpaper[nowIndex].question,
		stanswer: stdAnswer[nowIndex].stanswer,
		point: 0
	};

	if([testpaper[nowIndex].answer1, testpaper[nowIndex].answer2, testpaper[nowIndex].answer3, testpaper[nowIndex].answer4, testpaper[nowIndex].answer5].indexOf(stdAnswer[nowIndex].stanswer) > -1) {
		data.point += testpaper[nowIndex].point;
	}

	$.ajax({
		url: 'saveAnswer',
		type: 'POST',
		data: {asid: asid, data: data},
		success: function(result) {
			if(result.flag) {
				alert("저장되었습니다. \n이어서 작성해주세요.");
				$(target).siblings("input[name=asid]").val(result.asid);
				stdAnswer[nowIndex].asid = result.asid;
				clickNextBtn();
			} else {
				alert("오류가 발생하였습니다. \n잠시 후 다시 시도해주세요.");
			}
		}
	});
}

function saveStudentTestResult(savedata, callback) {
	$.ajax({
		url: 'saveStudentTestResult',
		type: 'POST',
		data: {saveData: savedata},
		success: function(result) {
			callback(result);
		}
	});
}

function checkStartTestTime(mktid, callback) {
	$.ajax({
		url: 'checkStartTestTime',
		type: 'GET',
		data: {mktid: mktid},
		success: function(result) {
			callback(result);	
		}
	});
}

function checkTestTime(mktid, flag, endtime) {
	$.ajax({
		url: 'checkTestTime',
		type: 'GET',
		data: {mktid:mktid, endtime:endtime, flag:flag},
		success: function(result) {
			flag = 1;
			if(result.flag) {
				alert("시험이 종료되었습니다.");
				sendAnswer();
			} else {
				setTimeout(function(){checkTestTime(mktid, flag, result.endtime);}, 10*1000);
			}
		}
	});
}

function onKeyDownAnswerBox(e, target) {
	if(event.keyCode != 13) return;
	checkanswerbox(target);
	clickNextBtn();
}

function formatStr() {
	$(".date").each(function() {
		var date = $(this).text();
		$(this).text(date.substring(0,4) + "-" + date.substring(4,6) + "-" + date.substring(6,8));
	});

	$(".time").each(function() {
		var time = $(this).text();
		$(this).text(time.substring(0,2) + ":" + time.substring(2,4));
	});
}

function formatDate(str) {
	return str.substring(0,4) + "-" + str.substring(4,6) + "-" + str.substring(6,8);
}

function formatTime(str) {
	return str.substring(0,2) + ":" + str.substring(2,4);
}

function getToday(date) {
	return date.getFullYear() + "-" + rightToleftRead("0"+(date.getMonth()+1),2) + "-" + rightToleftRead("0"+date.getDate(),2);
}

function rightToleftRead(str, len) {
	return str.slice(-len);
}