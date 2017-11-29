var editor;
//给项目页设置定时器
$(function(){

	$("button[name='refresh']").click(function(){
		$("#now_ck_num").text(0);
	});
	$("#orderDiv button[name='paginationSwitch']").after('<button class="btn btn-default" title="trash" name="trash" id="removeOrder"><i class="glyphicon glyphicon-trash icon-trash"></i></button>');

	//给项目页设置定时器
	setInterval("rf_bsTable('orderTable')", 300000); 
	//实时统计选中checkbox的个数		
	checkedNow1('orderTable','now_ck_num'); 

	//编辑按钮
	$("#editOrder").click(function(){
		clearForm();
		$('.modal-title').text("编辑订单");
		
		var row = editParams('orderTable','orderModal'); //获该行所有数据，打开模态框
		if(row){

			var allFormParams = $("#orderForm").serializeArray()  //所有表单中的数据
			for(var i=0;i<allFormParams.length;i++){
				var key = allFormParams[i]["name"];
				$("#"+key).val(row[key]);
				
			};
		};
		
	});
	//新建按钮
	$("#creatOrder").click(function(){
		clearForm();
		$('.modal-title').text("新建订单");
		$('#orderModal').modal('show');   

		var allFormParams = $("#orderForm").serializeArray()  //所有表单中的数据
		for(var i=0;i<allFormParams.length;i++){
			var key = allFormParams[i]["name"];
			if(key == "pay_method"){
				$("#"+key).val("线下");
			}else if(key == "pay_status"){
				$("#"+key).val("未付款");
			}else{
				$("#"+key).val("");
			};	
		};
		
	});

//添加点击函数 这里直接写入了remove所用的参数，第一个参数是当前的表格id，第二个是网后台传的id，最后是向后台发送的地址
	$("#removeOrder").click(function(){
		remove('orderTable','id','json/order.json');       //陈向伟
		$("#now_ck_num").text(0);
	});


	var  appListOptions={
		dataType:'json',
		success:function(data) {
			if(data['status']=='ERROR'){
				alert(data['data']);
			}else{
				$("#orderTable").bootstrapTable('refresh');
				$("#now_ck_num").text(0);	
				$('#orderModal').modal('hide');
				alert("提交成功！");						
			}
		},
		error:function(){
			alert('error');	
		}
	};

	
	$("#orderForm").submit(function(){
		$(this).ajaxSubmit(appListOptions);
		return false;
	});


});


//表格中的中文显示
function daytime_style(mark) {
	return mark+"天";
}
function longtext_style(mark) {
	return mark+"G";
}

function clearForm(){
	var allFormParams = $("#orderForm").serializeArray();  //所有表单中的数据
	
	for(var i=0;i<allFormParams.length;i++){
		var key = allFormParams[i]["name"];

		if(key == "pay_method"){
			$("#"+key).val("线下");
		}
		else if(key == "pay_status"){
			$("#"+key).val("未付款");
		}
		else{
			$("#"+key).val("");
		}
	};
};