//给项目页设置定时器
$(function(){
	//给项目页设置定时器
	setInterval("rf_bsTable('userTable')", 300000); 
	setInterval("rf_bsTable('companyTable')", 300000); 
	//实时统计选中checkbox的个数		
	checkedNow1('userTable','user_ck_num'); 	
	checkedNow1('companyTable','company_ck_num'); 
	//点击刷新时清除选中
	refreshTable("userDiv","user_ck_num");
	refreshTable("companyDiv","company_ck_num");
	//添加删除按钮
	$("#userDiv button[name='paginationSwitch']").after('<button class="btn btn-default" title="trash" name="trash" id="removeUser"><i class="glyphicon glyphicon-trash icon-trash"></i></button>');
	$("#companyDiv button[name='paginationSwitch']").after('<button class="btn btn-default" title="trash" name="trash" id="removeCompany"><i class="glyphicon glyphicon-trash icon-trash"></i></button>');



	//添加点击函数 这里直接写入了remove所用的参数，第一个参数是当前的表格id，第二个是网后台传的id，最后是向后台发送的地址
	$("#removeUser").click(function(){
		remove('userTable','id','json/user.json');
		$("#user_ck_num").text(0);
	});
	$("#removeCompany").click(function(){
		remove('companyTable','id','json/company.json');
		$("#company_ck_num").text(0);
	});

	//个人的编辑按钮
	$("#editUser").click(function(){
		clearForm("userForm");
		editButton("userForm","userTable","userModal");
	});
	//企业的编辑按钮
	$("#editCompany").click(function(){
		clearForm("companyForm");
		editButton("companyForm","companyTable","companyModal");
	});

	
	//文件上传(url为向后台传的地址，uploadId为上传按钮的id，inputId为返回的路径填写到的input)
	//个人上传头像
	$("#userFace").click(function(){
		uploadFile('json/uploadUrl.json','userFace','#userPic')      //陈向伟
	});
	//公司上传头像
	$("#companyFace").click(function(){
		uploadFile('json/uploadUrl.json','companyFace','#companyPic')      //陈向伟
	});
	
});

//传数据
$(function(){
	//广告
	submitData("json/user.json","userTable","user_ck_num","userModal","userForm");   //陈向伟
	//招聘
	submitData("json/company.json","companyTable","company_ck_num","companyModal","companyForm");
});

//-------------------------------------------函数------------------------------
//删除选中的行
function removeUser(){
	num = checkedNum("userTable");					//选中个数
	remove_confirm("userTable","id",num,'json/userManagement.json');	//删除。参数分别是bootstrap的名字（用来刷新），列名字（ID），删除的数量（用于显示删除几项），后台传输的地址
};

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
//状态中文显示
function userStatus(State) {
	if ( State == "apply"){
		return '申请中';
		};	
    if ( State == "forbid"){
		return  '禁止';
		};
	if ( State == "normal"){
		return '正常';
		};
};

//清空表格参数
function clearForm(formId){
	var allFormParams = $("#"+formId).serializeArray()  //所有表单中的数据
	for(var i=0;i<allFormParams.length;i++){				
		var key = allFormParams[i]["name"];
		if(key == "status"){
			$("#"+formId +" ."+key).val("normal");
		}else{
			$("#"+formId +" ."+key).val("");
		}
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