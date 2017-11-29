//给项目页设置定时器
$(function(){
	//给项目页设置定时器
	setInterval("rf_bsTable('ad_table')", 300000); 
	setInterval("rf_bsTable('recruit_table')", 300000);
	setInterval("rf_bsTable('tool_table')", 300000);
	//实时统计选中checkbox的个数		
	checkedNow1('ad_table','ad_ck_num'); 	
	checkedNow1('recruit_table','recruit_ck_num'); 
	checkedNow1('tool_table','tool_ck_num'); 
	//点击刷新时清除选中
	refreshTable("adDiv","ad_ck_num");
	refreshTable("recruitDiv","recruit_ck_num");
	refreshTable("toolDiv","tool_ck_num");
	//添加删除按钮
	$("#adDiv button[name='paginationSwitch']").after('<button class="btn btn-default" title="trash" name="trash" id="removeAd"><i class="glyphicon glyphicon-trash icon-trash"></i></button>');
	$("#recruitDiv button[name='paginationSwitch']").after('<button class="btn btn-default" title="trash" name="trash" id="removeRecruit"><i class="glyphicon glyphicon-trash icon-trash"></i></button>');
	$("#toolDiv button[name='paginationSwitch']").after('<button class="btn btn-default" title="trash" name="trash" id="removeTool"><i class="glyphicon glyphicon-trash icon-trash"></i></button>');



	//添加点击函数 这里直接写入了remove所用的参数，第一个参数是当前的表格id，第二个是网后台传的id，最后是向后台发送的地址
	$("#removeAd").click(function(){
		remove('ad_table','id','json/ms_right_ad.json');    //陈向伟  所有删除的都要有状态  data['status']  跟之前一样,成功或失败出现相应提示在data['data']里
		$("#ad_ck_num").text(0);
	});
	$("#removeRecruit").click(function(){
		remove('recruit_table','id','json/ms_right_recruit.json');
		$("#recruit_ck_num").text(0);
	});
	$("#removeTool").click(function(){
		remove('tool_table','id','json/ms_right_tool.json');
		$("#tool_ck_num").text(0);
	});


	//广告的编辑按钮
	$("#ad_button").click(function(){
		clearForm("adForm");
		editButton("adForm","ad_table","adModal");
	});
	//招聘的编辑按钮
	$("#recruit_button").click(function(){
		clearForm("recruitForm");
		editButton("recruitForm","recruit_table","recruitModal");
	});	

	//工具的编辑按钮
	$("#tool_button").click(function(){
		clearForm("toolForm");
		editButton("toolForm","tool_table","toolModal");
	});

	//广告的新增按钮
	$("#newAd").click(function(){
		clearForm("adForm");
		$('#adModal').modal('show');      //打开模态框
	});
	//招聘的新增按钮
	$("#newRecruit").click(function(){
		clearForm("recruitForm");
		$('#recruitModal').modal('show');      //打开模态框
	});
	//工具排名的新增按钮
	$("#newTool").click(function(){
		clearForm("toolForm");
		$('#toolModal').modal('show');      //打开模态框
	});

	//文件上传(url为向后台传的地址，uploadId为上传按钮的id，inputId为返回的路径填写到的input)
	$("#uploadAdPic").click(function(){
		uploadFile('json/uploadUrl.json','uploadAdPic','#pic')      //陈向伟
	});
});

//传数据
$(function(){
	//广告
	submitData("json/ms_right_ad.json","ad_table","ad_ck_num","adModal","adForm");
	//招聘
	submitData("json/ms_right_recruit.json","recruit_table","recruit_ck_num","recruitModal","recruitForm");
	//工具排名
	submitData("json/ms_right_tool.json","tool_table","tool_ck_num","toolModal","toolForm");
});
//-------------------------------------------函数------------------------------

//获该行所有数据，打开模态框
function editParams(tableId,modalId){   //三个参数分别是，要编辑的table的id， 需要打开的模态框的名字， 返回值为选中行的所有参数
	num = checkedNum(tableId);
	if(num == 1){
		var rowData
		$('#'+modalId).modal('show');      //打开模态框
		$.map($("#"+tableId).bootstrapTable('getSelections'), function (row) {
			rowData = row;
		});
		return rowData;
	}
	else{
		alert("请选择 1 项进行编辑！")
		return false;
		}
};

//清空表格参数
function clearForm(formId){
	var allFormParams = $("#"+formId).serializeArray()  //所有表单中的数据
	for(var i=0;i<allFormParams.length;i++){				
		var key = allFormParams[i]["name"];
		$("#"+formId +" ."+key).val("");
	};
};
//编辑按钮执行函数
function editButton(form,table,modal){
	var row = editParams(table,modal); //获该行所有数据，打开模态框
	if(row){
		var allFormParams = $("#"+form).serializeArray()  //所有表单中的数据
		for(var i=0;i<allFormParams.length;i++){				
			var key = allFormParams[i]["name"];
			$("#"+form +" ."+key).val(row[key]);		
		};
	};
};

//数据传输
function submitData(url,table,ck_num,modal,form){
	var  options={  dataType:'json',
					url:url, //请求url    陈向伟
					success:function(data) {
				    	if(data['status']=='ERROR'){    //请求成功但没有执行成功
							$("#"+table).bootstrapTable('refresh');      //刷新
							$("#"+ck_num).text(0);
				    		alert(data['data']);
				    	}else{
							$("#"+table).bootstrapTable('refresh');
							$("#"+ck_num).text(0);	
							$('#'+modal).modal('hide');
							alert("提交成功！");						
				    	}
					},
					error:function(XMLHttpRequest) {
				       alert(XMLHttpRequest.status +' '+ XMLHttpRequest.statusText);   	
					}
	};
	//使用jquery form进行提交
	$("#"+form).submit(function(){
		$(this).ajaxSubmit(options);
		return false;
	});
};