var editor;
//给项目页设置定时器
$(function(){
	$("button[name='refresh']").click(function(){
		$("#now_ck_num").text(0);
	});
	$("#newsDiv button[name='paginationSwitch']").after('<button class="btn btn-default" title="trash" name="trash" id="removeNews"><i class="glyphicon glyphicon-trash icon-trash"></i></button>');

	//给项目页设置定时器
	setInterval("rf_bsTable('newsTable')", 300000); 
	//实时统计选中checkbox的个数		
	checkedNow1('newsTable','now_ck_num'); 


	KindEditor.options.filterMode = false;
    KindEditor.ready(function(K) {
        editor = K.create('#detail', {
            allowFileManager : true
        });
        
    });

	//二级联动
	$("#cat_id").change(function(){
		var cat_id = $("#cat_id").val();  //当前选择的一级标题
		add_cat_id(cat_id);
	});

	//新增按钮
	$("#creatNews").click(function(){
		
		$('.modal-title').text("添加页面");
		clearForm();
		$('#newsModal').modal('show');      //打开模态框
	});

	//编辑按钮
	$("#editNews").click(function(){
		$('.modal-title').text("编辑页面");
		clearForm();
		var row = editParams('newsTable','newsModal'); //获该行所有数据，打开模态框
		if(row){
			$.ajax({
				url:'json/decDetail.json',     //陈向伟，传给你id  返回正文信息
				type:'get',
				data:{id:row.id},
				dataType: "json",
				success:function(data,textStatus){
					for(var key in data.data){
						if(key=="detail"){
							editor.html(data.data["detail"]);
						}else{
							$("#"+key).val(data.data[key])
						}
					}
				},
				error: function(XMLHttpRequest){
					alert(XMLHttpRequest.status +' '+ XMLHttpRequest.statusText);
				}
				 
			});  

		}	
			
			
		
	})

	//文件上传(url为向后台传的地址，uploadId为上传按钮的id，inputId为返回的路径填写到的input)
	$("#uploadNewsPic").click(function(){
		uploadFile('json/uploadUrl.json','uploadNewsPic','#pic')      //陈向伟
	});

//添加点击函数 这里直接写入了remove所用的参数，第一个参数是当前的表格id，第二个是网后台传的id，最后是向后台发送的地址
	$("#removeNews").click(function(){
		remove('newsTable','id','json/dec.json');       //陈向伟
		$("#now_ck_num").text(0);
	});
	$("#newsForm").submit(function(){
		debugger
		var formData=allParams("newsForm");
		editor.sync();
		var textDetail= $("#detail").val(); 
		var  appListOptions={  
							data: {
				              "formData":formData,
				              "text":textDetail
				            },
							dataType:'json',
							success:function(data) {
								if(data['status']=='ERROR'){
									alert(data['data']);
								}else{
									$("#newsTable").bootstrapTable('refresh');
									$("#now_ck_num").text(0);	
									$('#newsModal').modal('hide');
									alert("提交成功！");						
								}
							},
							error:function(){
								alert('error');	
							}
		}
		$(this).ajaxSubmit(appListOptions);
		
		return false;
	});


});

//删除选中的行
function removeUser(){
	num = checkedNum("userTable");					//选中个数
	remove_confirm("userTable","userName",num,'json/job.json');	//删除。参数分别是bootstrap的名字（用来刷新），列名字（ID），删除的数量（用于显示删除几项），后台传输的地址
};                                    //陈向伟


//清空表格里的数据
function clearForm(){
	var allFormParams = $("#newsForm").serializeArray();  //所有表单中的数据
	
	for(var i=0;i<allFormParams.length;i++){
		var key = allFormParams[i]["name"];

		if(key == "detail"){
			editor.html('');
		}
		else if(key == "cat_id"){
			$("#"+key).val("01");
			add_cat_id("01")
		}
		else if(key == "cat_name"){
			$("#"+key).val("前沿研究");
		}
		else if(key == "short_num"){
			$("#"+key).val("7");
		}
		else{
			$("#"+key).val("");
		}
	};
	//$("#cat_name").val("前沿研究");
};

function allParams(id){
	var app = $("#"+id).serializeArray();
	var json1 = {};
	for(var i=0;i<app.length;i++){
			var name = app[i].name;
			var value = app[i].value;
			json1[name] = value;
	}
	return json1;
};