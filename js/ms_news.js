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
		
		$('.modal-title').text("添加新闻");
		clearForm();
		$('#newsModal').modal('show');      //打开模态框
	});

	//编辑按钮
	$("#editNews").click(function(){
		$('.modal-title').text("编辑新闻");
		clearForm();
		var row = editParams('newsTable','newsModal'); //获该行所有数据，打开模态框
		
		if(row){
			$.ajax({
				url:'json/newsDetail1.json',     //陈向伟，传给你id  返回正文信息
				type:'post',
				data:{id:row.id},
				dataType: "json",
				success:function(data,textStatus){
					editor.html(data.data);
				},
				error: function(XMLHttpRequest){
					alert(XMLHttpRequest.status +' '+ XMLHttpRequest.statusText);
				}
				 
			});  

			var ii;
			var allFormParams = $("#newsForm").serializeArray()  //所有表单中的数据
			console.log(allFormParams)
			for(var i=0;i<allFormParams.length;i++){
				var key = allFormParams[i]["name"];
				var value = allFormParams[i]["value"];
				if(key =="detail"){
					continue;
				}
				else if(key == "cat_id"){
					$("#"+key).val(row[key]);
					add_cat_id(row[key]);
				//	console.log(value);
				}
				else if(key == "cat_name"){
					var ii = row[key];
				}
				else{
					$("#"+key).val(row[key]);
				}
			};
			$("#cat_name").val(ii);
		};
		
	});

	//文件上传(url为向后台传的地址，uploadId为上传按钮的id，inputId为返回的路径填写到的input)
	$("#uploadNewsPic").click(function(){
		uploadFile('json/uploadUrl.json','uploadNewsPic','#pic')      //陈向伟
	});

//添加点击函数 这里直接写入了remove所用的参数，第一个参数是当前的表格id，第二个是网后台传的id，最后是向后台发送的地址
	$("#removeNews").click(function(){
		remove('newsTable','id','json/news.json');       //陈向伟
		$("#now_ck_num").text(0);
	});


	var  appListOptions={  dataType:'json',
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
	};

	
	$("#newsForm").submit(function(){
		
		editor.sync();
		$(this).ajaxSubmit(appListOptions);
		return false;
	});


});

//删除选中的行
function removeUser(){
	num = checkedNum("userTable");					//选中个数
	remove_confirm("userTable","userName",num,'json/job.json');	//删除。参数分别是bootstrap的名字（用来刷新），列名字（ID），删除的数量（用于显示删除几项），后台传输的地址
};                                    //陈向伟

//表格中的中文显示
function cat_id_Chinese(mark) {
	if ( mark == '01'){
		return '新闻快讯';
		};	
	if ( mark == '02'){
		return  '云中漫步';
		};
}

//根据cat_id 分类i加载
function add_cat_id(cat_id){
	if(cat_id == "01"){
		$("#cat_name_div").remove();
		$("#cat_id_div").after('<div class="form-group user_form_height"  id="cat_name_div"><label class="col-sm-2 user_label">分类ii</label><div class="col-sm-9"><select id="cat_name" class="form-control input-sm" name="cat_name"><option value="前沿研究" selected = "selected">前沿研究</option><option value="市场动态" >市场动态</option></select></div></div>');

	}
	else if(cat_id == "02"){
		$("#cat_name_div").remove();
		$("#cat_id_div").after('<div class="form-group user_form_height"  id="cat_name_div"><label class="col-sm-2 user_label">分类ii</label><div class="col-sm-9"><select id="cat_name" class="form-control input-sm" name="cat_name"><option value="DNA" selected = "selected">DNA</option><option value="RNA" >RNA</option><option value="小工具" >小工具</option><option value="健康医学" >健康医学</option></select></div></div>');
	}
	else{
	}
};

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