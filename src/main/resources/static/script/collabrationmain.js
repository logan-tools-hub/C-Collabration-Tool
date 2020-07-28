var CollabrationJs = {
	init: function() {
		var _this = this;

		console.log("Inside init");
		_this.renderPage();
		_this.registerEvents();
		_this.generateHandlebars();
	},
	registerEvents : function() {
		var _this = this;
		
		var pressed = false;
	    var start = undefined;
	    var startX, startWidth;
	    
		$(".cls_collabrationSearchInput").off("keyup").on("keyup", function(){
			var serachText = $(this).val();
			if(serachText && serachText.length >= 3) {
				_this.serachContent(serachText);				
			}
		});
		$(".cls_formatToolIcon").off("click").on("click", function(){
			var action = $(this).attr("action");
			document.execCommand(action,false,null);
		});
		$(".pt-3-half").off("click").on("click", function(){
			
		});
			
		$(".selectpicker").off("change").on("change",function(){
			var currentFontSize = $(this).val();
			 var selectedElement = window.getSelection().anchorNode.parentNode
			 document.execCommand("fontsize", false, currentFontSize);
			 var fontElement = $(selectedElement).parent().find("font[size=7]");
			 $(fontElement).removeAttr("size").css("font-size",currentFontSize+"px");
				
		});
		
		$(".cls_drawTableIcon").off("mouseover").on("mouseover",function(){
			$(".cls_drawTable").addClass("show");
			_this.sel = window.getSelection();
			if(!_this.sel) {
				_this.sel = window.getSelection();	
			}
			console.dir(_this.sel);
		});
		$(".pt-3-half").off("click").on("click",function(){
			$(".cls_drawTable").removeClass("show");
			$(".pt-3-half").removeClass("cls_columnSelected");
		});
		$(".pt-3-half").off("focusout").on("focusout",function(){
			$(".cls_drawTable").removeClass("show");
			$(".pt-3-half").removeClass("cls_columnSelected");
		});
		$(".pt-3-half").off("mouseover").on("mouseover",function(){
			$(".pt-3-half").removeClass("cls_columnSelected");
			var currentColumn = $(this).attr("coln");
			var row = currentColumn.split(",")[0];
			var column = currentColumn.split(",")[1];
			
			
			var sel, range;

			sel = _this.sel || {};
			if(sel.getRangeAt && sel.rangeCount) {
	    		range = sel.getRangeAt(0);
	    		range.deleteContents();
	    		var timeStamp = Date.now();
	    		var div = document.createElement("div");
	    		div.setAttribute("class", "cls_"+ timeStamp);
	    		range.insertNode(div);
			}
		        
	        var htmlTable = '<table class="table table-bordered table-responsive-md table-striped text-center">';
	        htmlTable += '<tbody>';
	        
	        for(i=1; i<=row; i++) {
	        	
	        	htmlTable += '<tr>';
	        	for(j=1; j<=column; j++) {
	        		if(i == 1) {
	        			htmlTable += '<th class="pt-3-half" contenteditable="true"></th>';	
	        		} else {	        			
	        			htmlTable += '<td class="pt-3-half" contenteditable="true"></td>';		        		
	        		}
	        		$(".pt-3-half[coln='"+i+","+j+"']").addClass("cls_columnSelected");
	        	}
	        	htmlTable += '</tr>';
	        }
	        
	        htmlTable += '</tbody>';
	        htmlTable += '</table>';
	        
	        $(".cls_" + timeStamp).html(htmlTable);
	        _this.registerEvents();
		});
		
		$("#input-file-now").off("change").on("change",function() {
			var images = this;
			
			if (images.files && images.files[0]) {
			      var reader = new FileReader();
			      reader.onload = function(event) {
			        $(".modal-body .cls_imagePreview").append("<img class='cls_uploadImgViewer resizable draggable' src='"+event.target.result+"'/>");
			      }
			      reader.readAsDataURL(images.files[0]);
			   }
		});
	
		$(".close").off("click").on("click",function(){
			
			$(".cls_imagePreview").html("");
		});
		$(".cls_uploadImagesToBody").off("click").on("click",function(){
			
			var sel, range;
		    if (window.getSelection) {
		        sel = window.getSelection();
		        if (sel.getRangeAt && sel.rangeCount) {
		        	for(i=0; i<$(".cls_uploadImgViewer").length; i++) {		        		
		        		range = sel.getRangeAt(0);
		        		//range.deleteContents();
		        		var img = document.createElement("IMG");
		        		img.setAttribute("width", "304");
		        		img.setAttribute("height", "228");
		        		img.setAttribute("class", "draggable resizable");
		        		img.setAttribute("src", $($(".cls_uploadImgViewer")[i]).attr("src"));
		        		range.insertNode(img);
		        	}
		        }
		    }
		    
			//$(".cls_pageContentWrap").append();
			$("#basicExampleModal .close").trigger("click");
			
			$(".draggable").draggable();
			$(".resizable").resizable();

		});
		
		$(".cls_contentUpdateBtn").off("click").on("click", function() {
			_this.updatePageContent();
		});
		
		$(".cls_contentSaveBtn").off("click").on("click", function() {
			_this.savePageContent();
		});
		
		$(".cls_btn_pageEdit").off("click").on("click", function(){
			_this.contentEdit();
		});
		
		$("table th").off("mousedown").on("mousedown", function(event){
			start = $(this);
	        pressed = true;
	        startX = event.pageX;
	        startWidth = $(this).width();
	        $(start).addClass("resizing");
		});
		
		$(document).off("mousemove").on("mousemove", function(event){
			if(pressed) {
	            $(start).width(startWidth+(event.pageX-startX));
	        }
		});

		$(document).off("mouseup").on("mouseup", function(event){
			if(pressed) {
	            $(start).removeClass("resizing");
	            pressed = false;
	        }
		});
		$(".cls_btn_pageCreate").off("click").on("click", function(){
			location.href = "/page/content";
		});
		
		$(".cls_gct_headerWrap ").off("click").on("click", function(){
			location.href = "/";
		});
	},
	savePageContent: function() {
		
		var content = escape(escape($(".cls_pageContentWrap").html()));
		var header = escape(escape($(".cls_pageTitle .cls_pageTitleTxt").text()));
		var author = escape(escape($(".cls_authorNameTxt").html()));
		
		var successCbk = function(response) {
			
			$("body").removeClass("position-fixed");
			$(".cls_mask").addClass("d-none");
			$('.cls_btn_pageEdit').removeClass("d-none");
			$('.cls_formatTools').addClass("d-none");
			
			if("Page already exist!" == response) {
				alert("Already a page is available for the same header. Please change header");
			} else {				
				location.href = "/page/" + unescape(unescape(response.header));
			}

		};
	
		var failure = function(response) {
			console.dir("Inside failureCbk");
			console.debug(response);
			$("body").removeClass("position-fixed");
			$(".cls_mask").addClass("d-none");
		};
		var contentData = {
				content : content,
				header : header,
				author : author
			};
		var config = {
				url: "http://localhost:8080/page/save",
				type: "POST",
				headers: {
				    "Content-Type" : "application/json"
				  },
				success: successCbk,
				error: failure,
				data: JSON.stringify(contentData),
				
		};
		$("body").addClass("position-fixed");
		$(".cls_mask").removeClass("d-none");
		$.ajax(config);
		
	},
	updatePageContent : function() {
		
		var pageId = $(".cls_pageIdHide").attr("pageId");
		var content = escape(escape($(".cls_pageContentWrap").html()));
		var header = escape(escape($(".cls_pageTitle .cls_pageTitleTxt").text()));
		var author = escape(escape($(".cls_authorNameTxt").html()));
		
		var successCbk = function(response) {
			console.dir("Inside successCbk");
			$("body").removeClass("position-fixed");
			$(".cls_mask").addClass("d-none");
			$('.cls_btn_pageEdit').removeClass("d-none");
			$('.cls_formatTools').addClass("d-none");
			
			$('.cls_pageTitle .cls_pageTitleTxt').attr('contenteditable','false');
			$('.cls_authorNameTxt').attr('contenteditable','false');
			$('.cls_pageContentWrap').attr('contenteditable','false');
		};
	
		var failure = function(response) {
			console.dir("Inside failureCbk");
			console.debug(response);
			$("body").removeClass("position-fixed");
			$(".cls_mask").addClass("d-none");
		};
		var contentData = {
				content : content,
				header : header,
				author : author
			};
		var config = {
				url: "http://localhost:8080/page/update/" + pageId,
				type: "POST",
				headers: {
				    "Content-Type" : "application/json"
				  },
				success: successCbk,
				error: failure,
				data: JSON.stringify(contentData),
				
		};
		$("body").addClass("position-fixed");
		$(".cls_mask").removeClass("d-none");
		$.ajax(config);
	},
	uploadImagesToBody : function(images) {
		
	},
	drawTable: function(row, column) {
		var _this = this;
		
	},
	serachContent: function(serachTxt) {
		var _this = this;
		
		var successCbk = function(response) {
			console.dir(response);
			_this.renderSearchContent(response);
		};
	
		var failure = function(response) {
			console.debug(response);
		};
		
		var config = {
				url: "http://localhost:8080/search?search=" + serachTxt,
				success: successCbk,
				error: failure
		};
		$.ajax(config);
		
	},
	renderSearchContent : function (response) {
		var _this = this;
		
		if(Handlebars) {
			var template = Handlebars.compile(_this.tempTxt);
			var finalContent = template(response);
			$(".cls_SearchContentsWrap").html(finalContent);
		}
		
	},
	generateHandlebars : function(response) {
		var _this = this;
		
		
		_this.tempTxt ='{{#if result}}';
		_this.tempTxt +='<hr/>';
		_this.tempTxt +='<div class="cls_serachResultHdr">Your Search Results:</div>';
		_this.tempTxt += '{{#each result}}';
		_this.tempTxt += '<div class="cls_srchContentWrap">';
		_this.tempTxt += '<div class="cls_contentTitle"> <a href="http://localhost:8080/page/{{decode header}}">{{{unescape header ../searchTxt}}}</a><div>';
		_this.tempTxt += '<div class="cls_srchContentTxt">{{{unescape content ../searchTxt}}}</div>';
		_this.tempTxt += '<div><hr/>';
		_this.tempTxt += '{{/each}}';
		_this.tempTxt += '{{else}}';
		_this.tempTxt += '<div class="cls_noResult">Sorry no search result found!</div>';
		_this.tempTxt += '{{/if}}';
	},
	contentEdit: function() {
		$('.cls_pageTitle .cls_pageTitleTxt').attr('contenteditable','true');
		$('.cls_authorNameTxt').attr('contenteditable','true');
		$('.cls_pageContentWrap').attr('contenteditable','true');
		$('.cls_btn_pageEdit').addClass("d-none");
		$('.cls_formatTools').removeClass("d-none");
		$('.cls_contentUpdateBtn').removeClass("d-none");
		 
	},
	renderPage: function() {
		var _this = this;

		if($("body").hasClass("cls_previewPage")) {
			var pageId = $(".cls_pageIdHide").html();
			
			var successCbk = function(response) {
				console.dir("Inside successCbk");
				var content = response.content;
				var header = unescape(unescape(response.header));
				var author = unescape(unescape(response.author));
				document.title = header;
				if(content) {
					content = unescape(unescape(content));
				}
				
				$(".cls_pageContentWrap").html(content);
				$(".cls_PageTitleWrap .cls_pageTitle .cls_pageTitleTxt").html(header);
				$(".cls_PageTitleWrap .cls_authorNameTxt").html(author);
				$(".cls_pageIdHide").attr("pageId", response._id);
			};
		
			var failure = function(response) {
				console.dir("Inside failureCbk");
				console.debug(response);
			};
			
			var config = {
					url: "http://localhost:8080/page/render/" + escape(escape(escape(pageId))),
					success: successCbk,
					error: failure
			};
			$.ajax(config);
		} else if($("body").hasClass("cls_createNewPage")) {
			$(".cls_formatTools").removeClass("d-none");
			_this.contentEdit();
		}
	}
};

$(document).ready(function(){
	//initiate the javascript events
	CollabrationJs.init();
	
	if(Handlebars) {
		
		Handlebars.registerHelper('replace', function(content, searchTxt, options) {
			
			var searchTxt = searchTxt.split(" ");
			for(i=0; i<searchTxt.length; i++) {
				if(searchTxt[i].length >= 3) {					
					var pattern = new RegExp(searchTxt[i], 'gi');
					var replaceTxt = '<hl class="cls_hightlightTxt">'+searchTxt[i]+'</hl>';
					content = content.replace(pattern, replaceTxt);
				}
			}
			return content;
		});
		
		
		Handlebars.registerHelper('decode', function( text, options) {
			return unescape(unescape(text));
		});
		
		
		Handlebars.registerHelper('unescape', function(content,searchTxt, options) {
			
			var unescapedConent = unescape(unescape(content));
			console.log("searchTxt: "+ searchTxt);
			unescapedConent = unescapedConent.replace(/<\/?[^>]+(>|$)/g, "");
			 return Handlebars.helpers.replace(unescapedConent, searchTxt);
		});
	}
	
	$('#cp2').colorpicker().off("changeColor").on("changeColor", function(){
		console.log("Color Changed");
		//document.execCommand(action,false,null);
		var color = $(this).colorpicker('getValue', '#ffffff');
		document.execCommand('foreColor', false, $(this).colorpicker('getValue', '#ffffff'));
		$("#cp2 span i").attr("style", "");
		$("#cp2 span i").css("color", color);
	}).off("hidePicker").on("hidePicker", function() {
		console.log("Disable ");
		var color = $(this).colorpicker('getValue', '#ffffff');
		$("#cp2 span i").attr("style", "");
		$("#cp2 span i").css("color", color);
	});
	
});