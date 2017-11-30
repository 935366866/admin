var editor;
$(function(){
	KindEditor.options.filterMode = false;
    KindEditor.ready(function(K) {
        editor = K.create('#detail', {
            allowFileManager : true
        });
        
    });
    
    $("#newsForm").submit(function(){
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
									return false;
									alert("修改成功！");						
								}
							},
							error:function(){
								alert('error');	
							}
		}
		$(this).ajaxSubmit(appListOptions);
		return false;
	});
	
	
	$('#tree').treeview({data:getTree()}); 
	$('#tree').on('nodeSelected', function(event, data) {
		$.ajax({
				url:'json/dec1.json',     //陈向伟，传给你id  返回正文信息
				type:'get',
				data:{id:data.href},
				dataType: "json",
				success:function(data,textStatus){
					if(textStatus=="success"){
						for(var key in data.data){
							if(key=="detail"){
								editor.html(data.data["detail"]);
							}else{
								$("#"+key).val(data.data[key])
							}
						}
					}

				},
				error: function(XMLHttpRequest){
					alert(XMLHttpRequest.status +' '+ XMLHttpRequest.statusText);
				}
				 
			});  
	
	});
})

	function getTree(){
	   var tree = [
		    {
		    	text: "欢迎使用",
		    	href:"100"
		  	},
		  	{
		    	text: "注册及登录",
		    	href:"200"
		  	},
		  	{
		    	text: "首页",
		    	href:"300"
		  	},
			{
			    text: "数据分析",
			    href:"400",
			    nodes: [
				    {
				        text: "我的目录",
				        href:"410"
				    },
				    {
				        text: "分析流程",
				         href:"420",
				        nodes: [
				          {
				            text: "分析流程类型",
				            href:"421"
				          },
				          {
				            text: "分析流程使用",
				            href:"422"
				          },
				          {
				            text: "深度挖掘使用",
				            href:"423"
				          }
				        ]
				    },
				    {
				        text: "我的项目",
				        href:"430"
				    },
				    {
				        text: "回收站",
				        href:"440"
				    }
				    ,
				    {
				        text: "小工具",
				        href:"450",
				        nodes: [
					        {
					            text: "小工具类型",
					            href:"451"
					        },
					        {
					            text: "小工具使用",
					            href:"452"
					        }
				        ]
				    }
				    ,
				    {
				        text: "资源监控",
				        href:"460"
				    }
			    ]
			},
			{
			    text: "帮助",
			    href:"500"
			},
			{
			    text: "管理系统",
			    href:"600"
			},
			{
			    text: "退出",
			    href:"700"
			}
		  
		];
		return tree;  
   }  
   
   
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