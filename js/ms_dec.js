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
	function del(ele){
		cancelBubble();
		var pp= $('#tree').treeview('getSelected');
		console.log(pp)
		$('#tree').treeview('removeNode', [pp, { silent: true } ]);
		
	}
//parentNode
//targetNodes
 function cancelBubble(e) { 
    var evt = e ? e : window.event; 
    if (evt.stopPropagation) {        //W3C 
        evt.stopPropagation(); 
    }else {       //IE      
        evt.cancelBubble = true; 
    }  
 }
	function add(ele){
		$("#addModal").show();
		$("#menuNameBtn").click(function(){
			addMenu(ele);
		})
		 $("#menuName").keydown(function(k){
			if(k.keyCode==13 ){
				addMenu(ele);
			}
		});
	}
	
	function addMenu(ele){
		var value=$("#menuName").val();
//		$.ajax({
//			type:"(get)",
//			url:"",
//			data:{menuName:value},
//			
//		});
		$('#addModal').modal('hide')
		
		var  parentId=ele.parent("li").attr("data-nodeid");
		console.log(parentId)
		var pp= $('#tree').treeview('getSelected');
		console.log(pp)
		var arr=$('#tree').treeview('getParents');
		console.log(arr)
		var singleNode = {  
                    text: value ,
                   	tags: ['+<span class="del" onclick="del($(this))">-</span>']
                  };  
        $("#tree").treeview("addNode", [singleNode,parentId,{ silent: true }]);  
	}
	
	function getTree(){
	   var tree = [
		    {
		    	text: "欢迎使用",
		    	tags: ['+<span class="del" onclick="del($(this))">-</span>'],
		    	href:"100"
		  	},
		  	{
		    	text: "注册及登录",
		    	href:"200",
		    	tags: ['+<span class="del" onclick="del($(this))">-</span>']
		  	},
		  	{
		    	text: "首页",
		    	href:"300",
		    	tags: ['+<span class="del" onclick="del($(this))">-</span>']
		  	},
			{
			    text: "数据分析",
			    href:"400",
			    tags: ['+<span class="del" onclick="del($(this))">-</span>'],
			    nodes: [
				    {
				        text: "我的目录",
				        tags: ['+<span class="del" onclick="del($(this))">-</span>'],
				        href:"410"
				    },
				    {
				        text: "分析流程",
				        tags: ['+<span class="del" onclick="del($(this))">-</span>'],
				         href:"420",
				        nodes: [
				          {
				            text: "分析流程类型",
				            tags: ['+<span class="del" onclick="del($(this))">-</span>'],
				            href:"421"
				          },
				          {
				            text: "分析流程使用",
				            tags: ['+<span class="del" onclick="del($(this))">-</span>'],
				            href:"422"
				          },
				          {
				            text: "深度挖掘使用",
				            tags: ['+<span class="del" onclick="del($(this))">-</span>'],
				            href:"423"
				          }
				        ]
				    },
				    {
				        text: "我的项目",
				        tags: ['+<span class="del" onclick="del($(this))">-</span>'],
				        href:"430"
				    },
				    {
				        text: "回收站",
				        tags: ['+<span class="del" onclick="del($(this))">-</span>'],
				        href:"440"
				    }
				    ,
				    {
				        text: "小工具",
				        tags: ['+<span class="del" onclick="del($(this))">-</span>'], 
				        href:"450",
				        nodes: [
					        {
					            text: "小工具类型",
					            tags: ['+<span class="del" onclick="del($(this))">-</span>'],  
					            href:"451"
					        },
					        {
					            text: "小工具使用",
					            tags: ['+<span class="del" onclick="del($(this))">-</span>'], 
					            href:"452"
					        }
				        ]
				    }
				    ,
				    {
				        text: "资源监控",
				        tags: ['+<span class="del" onclick="del($(this))">-</span>'],
				        href:"460"
				    }
			    ]
			},
			{
			    text: "帮助",
			    tags: ['+<span class="del" onclick="del($(this))">-</span>'],
			    href:"500"
			},
			{
			    text: "管理系统",
			    tags: ['+<span class="del" onclick="del($(this))">-</span>'],
			    href:"600"
			},
			{
			    text: "退出",
			    tags: ['+<span class="del" onclick="del($(this))">-</span>'],
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