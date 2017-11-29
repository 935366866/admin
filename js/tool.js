
$(function(){
	//工具列表设置定时器
	setInterval("rf_bsTable('appListTable')", 300000); 
	//实时统计选中checkbox的个数		
	checkedNow('appListTable','appList_ck_num'); 
	checkedNow('appParamsTable','appParams_ck_num'); 
	checkedNow('appTypeListTable','appType_ck_num');
	

//--------------------工具管理界面-------------------------
$("#samplesNumber").addClass("controlHeight")
	//编辑按钮
	$("#editApp").click(function(){
		var row = editParams('appListTable','appListModal'); //获该行所有数据，打开模态框
		if(row){
			var allFormParams = $("#appListForm").serializeArray()  //所有表单中的数据
			for(var i=0;i<allFormParams.length;i++){
				var key = allFormParams[i]["name"];
				$("#"+key).val(row[key]);
			};
		};
	});
	//新增按钮
	$("#addApp").click(function(){
		var allFormParams = $("#appListForm").serializeArray()  //所有表单中的数据
		for(var i=0;i<allFormParams.length;i++){
			var key = allFormParams[i]["name"];
			$("#"+key).val("");
		};
		$('#appListModal').modal('show');      //打开模态框
	});
	
	//工具管理界面双击行
	$("#appListTable").bind('dbl-click-row.bs.table',function(row, $element){
		$("#dbParamName").html($element.appName)
		$('#appParamsModal').modal('show');      //打开模态框
		var id = $element.id;
		$.ajax({
				    url:"listToolParams",  
				    type:'post',
				    data:{pid:id},
				    dataType: "json",
				    success:function(data) {
				    	
							$('#appParamsTable').bootstrapTable(
									'load',data
							);
							$('#appParamForm #tool_id').val(id);
							$('#toolId').val(id);
							$("#appParams_ck_num").text(0);							
				    	
				     },    
				     error : function(XMLHttpRequest) {
				       alert(XMLHttpRequest.status +' '+ XMLHttpRequest.statusText);    
				     }
				});  
	});
//--------------------工具参数界面------------------------	
	//编辑按钮
	$("#editAppParam").click(function(){
		var row = editParams('appParamsTable','appParamModal'); //获该行所有数据，打开模态框
		if(row){
			var allFormParams = $("#appParamForm").serializeArray()  //所有表单中的数据
			for(var i=0;i<allFormParams.length;i++){
				var key = allFormParams[i]["name"];
				//$("#"+key).val(row[key]);
				$("#appParamForm input[name="+key+"],#appParamForm textarea[name="+key+"]").val(row[key]);
			};
		};
	});
	//新增按钮
	$("#addAppParam").click(function(){
		var allFormParams = $("#appParamForm").serializeArray()  //所有表单中的数据
		for(var i=0;i<allFormParams.length;i++){
			var key = allFormParams[i]["name"];
			if(key=='tool_id'){
				continue;
			}
			$("#"+key).val("");
			
		};
		$('#appParamModal').modal('show');      //打开模态框
	});
//--------------------工具类型界面------------------------
	//编辑按钮
	$("#editAppType").click(function(){
		var row = editParams('appTypeListTable','appTpyeModal'); //获该行所有数据，打开模态框
		if(row){
			var allFormParams = $("#appTypeForm").serializeArray()  //所有表单中的数据
			for(var i=0;i<allFormParams.length;i++){
				var key = allFormParams[i]["name"];
				//$("#"+key).val(row[key]);
				$("#appTypeForm input[name="+key+"],#appTypeForm textarea[name="+key+"]").val(row[key]);
			};
		};
	});
	//新增按钮
	$("#addAppType").click(function(){
		var allFormParams = $("#appTypeForm").serializeArray()  //所有表单中的数据
		for(var i=0;i<allFormParams.length;i++){
			var key = allFormParams[i]["name"];
			$("#"+key).val("");
		};
		$('#appTpyeModal').modal('show');      //打开模态框
	});
	//双击该类型进行编辑
	$("#appTypeListTable").bind('dbl-click-row.bs.table',function(row, $element){
//		console.log($element);
		$("#selectedType").html($element.appTypeName)
		$('#existAppModal').modal('show');      //打开模态框
		var id = $element.cat_id;
		$.ajax({
				    url:"listCatTools",  
				    type:'post',
				    data:{cat_id:id},
				    dataType: "json",
				    success:function(data) {
							$('#existAppTable').bootstrapTable('load',data);
							$("#CAT_ID").val(id);						
				     },    
				     error : function(XMLHttpRequest) {
				       alert(XMLHttpRequest.status +' '+ XMLHttpRequest.statusText);    
				     }
				});  
		
		$.ajax({
		    url:"listTools",  
		    type:'post',
		  //  data:{id:id},
		    dataType: "json",
		    success:function(data) {
					$('#allAppTable').bootstrapTable('load',data);
					//$("#appParams_ck_num").text(0);						
		     },    
		     error : function(XMLHttpRequest) {
		       alert(XMLHttpRequest.status +' '+ XMLHttpRequest.statusText);    
		     }
		});
	});
	//点击添加工具到该类别
	$("#addAppToExist").click(function(){
		var number = checkedNum("allAppTable");//选中个数
		var catid = $('#CAT_ID').val();
		if(catid == ''||catid=='null'){
			alert('类别不能为空');
			return false;
		}
		if(number == 0){ 
			alert("您还未选中任何项！")
			}
		else{
			var r=confirm("您确定要添加这" + number + "项吗？");
			if (r==true)
			  {	 var appType = $("#selectedType").text();
				 var appId =  getIdSelections("allAppTable","id")   //该函数获取ID
				 
				// console.log({appId:appId,appType:appType,operate:"add"});
				 $.ajax({
						url:'catAddTools',  
						type:'post',
						data:{ids:appId,CAT_ID:catid,operate:"add"},    //向后台传要删除的app的id和所属的app类型
						dataType: "json",
						success:function(data) {
							if(data['status']=='ERROR'){    //请求成功但没有执行成功
								$("#existAppTable").bootstrapTable('refresh');      //刷新
								$("#allAppTable").bootstrapTable('refresh');
								alert(data['data']);
							}else{
								$("#existAppTable").bootstrapTable('refresh',{query:{cat_id:catid}});
								$("#allAppTable").bootstrapTable('refresh');
								alert("添加成功！");								
							}
						 },    
						 error : function(XMLHttpRequest) {
						   alert(XMLHttpRequest.status +' '+ XMLHttpRequest.statusText);    
						 }
					});  
			  }
		}
	
	});
	
});
//表格中的中文显示
function param_mark(mark) {
	if ( mark == -1){
		return '禁用';
		};	
	if ( mark == 0){
		return  '选填';
		};
	if ( mark == 1){
		return '必填';
		};
};
function param_type(type) {
	if ( type == "text"){
		return '文本';
		};	
	if ( type == "number"){
		return  '数字';
		};
	if ( type == "select"){
		return  '下拉框';
	};
	if ( type == "dir"){
		return  '目录';
	};
	if ( type == "upload"){
		return '上传';
		};
};

//-------------------------------------------函数------------------------------

//删除选中的行
function remove(tableId,colName,url,pm){
	num = checkedNum(tableId);					//选中个数
	remove_confirm(tableId,colName,num,url,pm);	//删除。参数分别是bootstrap的名字（用来刷新），列名字（ID），删除的数量（用于显示删除几项），后台传输的地址
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



//传数据
$(function(){
//-------------------------------工具管理新建和编辑的提交
	var  appListOptions={  dataType:'json',
							success:function(data) {
								if(data['status']=='ERROR'){    //请求成功但没有执行成功
									$("#appListTable").bootstrapTable('refresh');      //刷新
									$("#appList_ck_num").text(0);
									alert(data['data']);
								}else{
									$("#appListTable").bootstrapTable('refresh');
									$("#appList_ck_num").text(0);	
									$('#appListModal').modal('hide');
									alert("提交成功！");						
								}
							},
							error:function(){
								alert('error');	
							}
	};

	$("#appListForm").submit(function(){
		$(this).ajaxSubmit(appListOptions);
		return false;
	});
//-------------------------------工具参数新建和编辑的提交 
	var  appParamOptions={  dataType:'json',
							success:function(data) {
								if(data['status']=='ERROR'){    //请求成功但没有执行成功
								//	$("#appParamsTable").bootstrapTable('refresh');      //刷新
									$("#appParams_ck_num").text(0);
									alert(data['data']);
								}else{
									var toolId = $("#toolId").val();
									$("#appParamsTable").bootstrapTable('refresh',{query:{pid:toolId}});
									$("#appParams_ck_num").text(0);	
									$('#appParamModal').modal('hide');
									alert("提交成功！");						
								}
							},
							error:function(){
								alert('error');	
							}
	};
	$("#appParamForm").submit(function(){
		$(this).ajaxSubmit(appParamOptions);
		return false;
	});
//-------------------------------工具类型新建和编辑的提交 
	var  appTypeOptions={  dataType:'json',
							success:function(data) {
								if(data['status']=='ERROR'){    //请求成功但没有执行成功
									$("#appTypeListTable").bootstrapTable('refresh');      //刷新
									$("#appType_ck_num").text(0);
									alert(data['data']);
								}else{
									$("#appTypeListTable").bootstrapTable('refresh');
									$("#appType_ck_num").text(0);	
									$('#appTpyeModal').modal('hide');
									alert("提交成功！");						
								}
							},
							error:function(){
								alert('error');	
							}
	};
	$("#appTypeForm").submit(function(){
		$(this).ajaxSubmit(appTypeOptions);
		return false;
	});	
});

