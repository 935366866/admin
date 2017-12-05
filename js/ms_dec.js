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
				data:{id:data.unId},
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
	
	$("#menuNameBtn").click(function(){
		addMenuAjax()
	})
	 $("#menuName").keydown(function(k){
		if(k.keyCode==13 ){
			addMenuAjax()
		}
	});
	$('#addModal').on('shown.bs.modal', function () {
	  $('#menuName').focus()
	})


})

	function addMenuAjax(){
		var name=$("#menuName").val();
		$.ajax({
			type:"get",
			url:"json/addMenu.json",
			async:true,
			data:{
				name:name,
				parentId:parentNode.unId
			},
			success:function(data){
				var unId = data.data.unId;
				addMenu(parentNode,name,unId);
			}
		});
	}
	function del(ele){
		cancelBubble();
		var nodeId = $(ele).parents("li").data("nodeid");
		var nodes= $('#tree').treeview('getNodes');
		var unId=null;
		var needDelNode=null;
		for (var i=0;i<nodes.length;i++) {
			if(nodes[i].nodeId==nodeId){
				unId=nodes[i].unId;
				needDelNode=nodes[i];
				break;
			}
		}	
		$.ajax({
			type:"post",
			url:"",
			data:{
				unId:unId
			},
			success:function(data){
				$('#tree').treeview('removeNode',[needDelNode, { silent: true } ]);
			}
		})
		
	}

	
	var parentNode = null;
	function add(ele){
		var nodeId = $(ele).parents("li").data("nodeid");
		var nodes= $('#tree').treeview('getNodes');
		for (var i=0;i<nodes.length;i++) {
			if(nodes[i].nodeId==nodeId){
				parentNode = nodes[i];
				break;
			}
		}
		
		if(!parentNode){
			alert("父节点不存在,无法添加子节点");
			return;
		}
		$("#addModal").show();
		
	}
	
	function addMenu(parentNode,name,unId){
		var singleNode = { 
                    text: name ,
                    unId:unId,
                   	tags: ['+<span class="del" onclick="del($(this))">-</span>']
                  };  

        $('#tree').treeview('addNode', [ singleNode, parentNode, 0, { silent: true } ]);
        $('#addModal').modal('hide')
	}
	
	function getTree(){
	   var tree = [
		    {
		    	text: "欢迎使用",
		    	tags: ['+<span class="del" onclick="del($(this))">-</span>'],
		    	unId:"100"
		  	},
		  	{
		    	text: "注册及登录",
		    	unId:"200",
		    	tags: ['+<span class="del" onclick="del($(this))">-</span>']
		  	},
		  	{
		    	text: "首页",
		    	unId:"300",
		    	tags: ['+<span class="del" onclick="del($(this))">-</span>']
		  	},
			{
			    text: "数据分析",
			    unId:"400",
			    tags: ['+<span class="del" onclick="del($(this))">-</span>'],
			    nodes: [
				    {
				        text: "我的目录",
				        tags: ['+<span class="del" onclick="del($(this))">-</span>'],
				        unId:"410"
				    },
				    {
				        text: "分析流程",
				        tags: ['+<span class="del" onclick="del($(this))">-</span>'],
				         unId:"420",
				        nodes: [
				          {
				            text: "分析流程类型",
				            tags: ['+<span class="del" onclick="del($(this))">-</span>'],
				            unId:"421"
				          },
				          {
				            text: "分析流程使用",
				            tags: ['+<span class="del" onclick="del($(this))">-</span>'],
				            unId:"422"
				          },
				          {
				            text: "深度挖掘使用",
				            tags: ['+<span class="del" onclick="del($(this))">-</span>'],
				            unId:"423"
				          }
				        ]
				    },
				    {
				        text: "我的项目",
				        tags: ['+<span class="del" onclick="del($(this))">-</span>'],
				        unId:"430"
				    },
				    {
				        text: "回收站",
				        tags: ['+<span class="del" onclick="del($(this))">-</span>'],
				        unId:"440"
				    }
				    ,
				    {
				        text: "小工具",
				        tags: ['+<span class="del" onclick="del($(this))">-</span>'], 
				        unId:"450",
				        nodes: [
					        {
					            text: "小工具类型",
					            tags: ['+<span class="del" onclick="del($(this))">-</span>'],  
					            unId:"451"
					        },
					        {
					            text: "小工具使用",
					            tags: ['+<span class="del" onclick="del($(this))">-</span>'], 
					            unId:"452"
					        }
				        ]
				    }
				    ,
				    {
				        text: "资源监控",
				        tags: ['+<span class="del" onclick="del($(this))">-</span>'],
				        unId:"460"
				    }
			    ]
			},
			{
			    text: "帮助",
			    tags: ['+<span class="del" onclick="del($(this))">-</span>'],
			    unId:"500"
			},
			{
			    text: "管理系统",
			    tags: ['+<span class="del" onclick="del($(this))">-</span>'],
			    unId:"600"
			},
			{
			    text: "退出",
			    tags: ['+<span class="del" onclick="del($(this))">-</span>'],
			    unId:"700"
			}
		  
		];
		var newTree=[{text:"菜单列表",nodes:tree}]
		return newTree;  
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
	
	function cancelBubble(e) { 
	    var evt = e ? e : window.event; 
	    if (evt.stopPropagation) {        //W3C 
	        evt.stopPropagation(); 
	    }else {       //IE      
	        evt.cancelBubble = true; 
	    }  
	}