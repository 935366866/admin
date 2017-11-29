$(function(){
    //管理系统导航鼠标悬停

 allList = $(".list_style");
	for(var i=0;i<allList.length;i++){
		allList[i].index = i;
		$(allList[i]).mouseover(function(e) {  
			addNavStyle(this.index,allList);
		});
		$(allList[i]).mouseout(function(e) {  
			removeNavStyle(this.index,allList);
		}); 
	}
});

//管理界面左边导航的控制
function addNavStyle(i,allList){
	$(allList[i]).attr("style","background:#09C;color:#fff;");
}
function removeNavStyle(i,allList){
	$(allList[i]).attr("style","");
}

//实时显示选中的checkbox数量
function checkedNow1(tableId,showId){
	var checkAll = ["check.bs.table","uncheck.bs.table","check-all.bs.table","uncheck-all.bs.table"]; //对其中的每一项进行绑定
	for(var i=0; i<checkAll.length; i++){
		$('#'+ tableId).on(checkAll[i], function () {   
	 		num = checkedNum(tableId);
			$('#' + showId).html(num);
	 	});
	}
};

//刷新按钮绑定该表格选中项清除，注意只在页面加载时调用一次
function refreshTable(divId,checkBoxId){
	$("#"+divId+" button[name='refresh']").click(function(){
		$("#" + checkBoxId +"").text(0);
	});	
};

//******************管理系统另外加的函数等······整体修改时间短，先加在common后面*************


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
	}else{
		alert("请选择 1 项进行编辑！")
		return false;
		}
};

//删除选中的行
function remove(tableId,colName,url){
	num = checkedNum(tableId);					//选中个数
	remove_confirm(tableId,colName,num,url);	//删除。参数分别是bootstrap的名字（用来刷新），列名字（ID），删除的数量（用于显示删除几项），后台传输的地址
};