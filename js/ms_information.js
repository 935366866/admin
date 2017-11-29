//给项目页设置定时器
$(function(){
	//给项目页设置定时器
	setInterval("rf_bsTable('infoTable')", 300000); 
	//实时统计选中checkbox的个数		
	checkedNow1('infoTable','now_ck_num'); 	
	//点击刷新时清除选中
	refreshTable("infoDiv","now_ck_num");

	//添加删除按钮
	$("#infoDiv button[name='paginationSwitch']").after('<button class="btn btn-default" title="trash" name="trash" id="removeInfo"><i class="glyphicon glyphicon-trash icon-trash"></i></button>');


	//添加点击函数 这里直接写入了remove所用的参数，第一个参数是当前的表格id，第二个是网后台传的id，最后是向后台发送的地址
	$("#removeInfo").click(function(){
		remove('infoTable','id','json/info.json');    //陈向伟  所有删除的都要有状态  data['status']  跟之前一样,成功或失败出现相应提示在data['data']里
		$("#now_ck_num").text(0);
	});

	//广告的新增按钮
	$("#newNews").click(function(){
		clearForm("submitNewMessage");
		$('#newMessage').modal('show');
	});

});

//传数据
$(function(){
	//消息
	submitData("json/info.json","infoTable","now_ck_num","newMessage","submitNewMessage");
});
//-------------------------------------------函数------------------------------

//清空表格参数
function clearForm(formId){
	var allFormParams = $("#"+formId).serializeArray()  //所有表单中的数据
	for(var i=0;i<allFormParams.length;i++){				
		var key = allFormParams[i]["name"];
		$("#"+formId +" ."+key).val("");
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

//任务的状态
function jobState(index, row) {
	if ( row.type == "sys"){
		return '<button class="btn btn-danger btn-xs" style="width:100px;">通知</button>';
	}else{
		if ( row.flag == "succeeded"){
			return  '<button class="btn btn-primary btn-xs" style="width:100px;">任务完成</button>';
		}
		if ( row.flag ==  "failed"){
			return '<button class="btn btn-warning btn-xs" style="width:100px;">任务中断</button>';
		}
	}
   
};

//点击具体任务跳转链接 linkJobDetial
function linkNewsDetial(name,row) {
	var newsId = row.id;
	//console.log(typeof(newsId))
	var str = "'"+newsId+"'"
	//console.log(str)
	if(row.status=='0'){
		return '<a href="#"  onclick="showNews('+str+',\'yes\')" id="'+newsId+'">'+ name +'</a>'
	}else{
		return '<a href="#" style="color: #781173" onclick="showNews('+str+',\'no\')" id="'+newsId+'">'+ name +'</a>'
	}
};

function showNews(id, bmark){  //陈向伟  请参考原来的程序
	//是否更改标记
	if(bmark=='yes'){
		$("#"+id).css('color','#781173');
		$("#"+id).attr('onclick', "showNews('"+id+"','no')")
	};
	
		$.ajax({
				    url:'json/infoDetial.json',     //原来是'__MODULE__/Notice/getNoticeInfo/bmark/'+bmark, 
				    type:'post',
				    data:{id:id},
				    dataType: "json",
				    success:function(data,textStatus) {
				    	if(data['status']=='ERROR'){    //请求成功但没有执行成功
				    		alert(data['data']);
				    	}else{
				    		data = data['data'];
				    		d=data;
							$('#newsDetial').modal('show');
							$("#infoTitle").html("名称：" + data.title);
							$("#infoSender").html("发送人：" + data.name);
							$("#infoTime").html("发送时间：" + data.send_time);
							infoDe = data.content.replace(/\n/gm,"")
							$("#infoDetial").html(infoDe);
							if(bmark=='yes'){
								navInterval();
							}
				    	}
				   	  },    
				    error : function(XMLHttpRequest) {
				       	alert(XMLHttpRequest.status +' '+ XMLHttpRequest.statusText);    
				     }
				}); 
	
	};
