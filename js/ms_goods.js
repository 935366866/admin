var editor;
//给项目页设置定时器
$(function(){

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


	$("button[name='refresh']").click(function(){
		$("#now_ck_num").text(0);
	});
	$("#goodsDiv button[name='paginationSwitch']").after('<button class="btn btn-default" title="trash" name="trash" id="removeGoods"><i class="glyphicon glyphicon-trash icon-trash"></i></button>');

	//给项目页设置定时器
	setInterval("rf_bsTable('goodsTable')", 300000); 
	//实时统计选中checkbox的个数		
	checkedNow1('goodsTable','now_ck_num'); 
	//点击刷新时清除选中
	refreshTable("adDiv","ad_ck_num");

	//编辑按钮
	$("#editGoods").click(function(){
		clearForm("goodsForm");
		editButton("goodsForm","goodsTable","goodsModal");	
	});

	//新增按钮
	$("#creatGoods").click(function(){
		clearForm("goodsForm");
		$('#goodsModal').modal('show');  
	});	

//添加点击函数 这里直接写入了remove所用的参数，第一个参数是当前的表格id，第二个是网后台传的id，最后是向后台发送的地址
	$("#removeGoods").click(function(){
		remove('goodsTable','id','json/goods.json');       //陈向伟
		$("#now_ck_num").text(0);
	});


	var  appListOptions={
		dataType:'json',
		success:function(data) {
			if(data['status']=='ERROR'){
				alert(data['data']);
			}else{
				$("#goodsTable").bootstrapTable('refresh');
				$("#now_ck_num").text(0);	
				$('#goodsModal').modal('hide');
				alert("提交成功！");						
			}
		},
		error : function(XMLHttpRequest) {
			alert(XMLHttpRequest.status +' '+ XMLHttpRequest.statusText);   
		}
	};

	
	$("#goodsForm").submit(function(){
		$(this).ajaxSubmit(appListOptions);
		return false;
	});

});

//清空表格参数
function clearForm(formId){
	var allFormParams = $("#"+formId).serializeArray()  //所有表单中的数据
	for(var i=0;i<allFormParams.length;i++){				
		var key = allFormParams[i]["name"];
		if(key == "provide"){
			$("#"+formId +" ."+key).val("北京拓美科基因科技有限公司");
		}else if(key == "goods_attr"){
			$("#"+formId +" ."+key).val("0");
		}
		else{
			$("#"+formId +" ."+key).val("");
		}
	};
};

//表格中的中文显示
function goods_attr_style(mark) {
	if(mark == "0"){
		return "热存储";
	}else{
		return "冷存储";
	}
}

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
