jQuery(document).ready(function($) {

	$( "#wpm-private-shortcode-dialog" ).dialog({
					autoOpen: false,
					height: 300,
					width: 275,
					modal: true,
					buttons: {
						"Create shortcode": function() {

							content =  '[private';

							var selected_levels = [];
							$('#wpm-private-shortcode-levels :checked').each(function() {
       								selected_levels.push($(this).val());
     							});
							if( selected_levels ){
								content +=  ' levels="'+selected_levels.join(",")+'"';
							}
							content +=  ']';
							selected = tinyMCE.activeEditor.selection.getContent();
							if( selected ){
								content +=  selected+'[/private]';
							}else{
								content +=  'private content here [/private]';
							}
							tinymce.execCommand('mceInsertContent', false, content);
							$(this).dialog("close");
						},
						Cancel: function() {
							$( this ).dialog( "close" );
						}
					},
				});
	$( "#wpm-download-shortcode-dialog" ).dialog({
					autoOpen: false,
					height: 600,
					width: 500,
					modal: true,
					buttons: {
						"Create shortcode": function() {
							var id= parseInt($('#wpm-download-id').val())
							var title = ( $('#wpm-download-title').attr('checked') ? 'title="true"' : '');
							var description = ( $('#wpm-download-description').attr('checked') ? 'description="true"' : '');
							var size = $('#wpm-button-size input:checked').val();
							var text =$('#wpm-download-button-text').val();
							var text_color = $('#wpm-button-text-color').val(); 
							var button_color = $('#wpm-button-color').val();
							var content =  '[wpm_download id="'+id+'" '+title+' '+description+' text="'+text+'" color="'+button_color+'" text_color="'+text_color+'" size="'+size+'" ]';
							tinymce.execCommand('mceInsertContent', false, content);
							$(this).dialog("close");
						},
						Cancel: function() {
							$( this ).dialog( "close" );
						}
					},
				});


	tinymce.create('tinymce.plugins.wpmemberPlugin', {
		init : function(ed, url) {
				// Register commands
				ed.addCommand('wpmembermcebutton', function() {
					$( "#wpm-private-shortcode-dialog" ).dialog("open");
				});
			ed.addCommand('wpmemberdownloadmcebutton', function() {
					$( "#wpm-download-shortcode-dialog" ).dialog("open");
				});

			// Register buttons
			ed.addButton('wpmember_button', {title : 'Insert private content', cmd : 'wpmembermcebutton', image: url + '/images/logolock-tinymce.png' });
			ed.addButton('wpmember_download_button', {title : 'Protected Downloads', cmd : 'wpmemberdownloadmcebutton', image: url + '/images/download-tinymce.png' });
		},
		 
	});
	 
	// Register plugin
	// first parameter is the button ID and must match ID elsewhere
	// second parameter must match the first parameter of the tinymce.create() function above
	tinymce.PluginManager.add('wpmember_button', tinymce.plugins.wpmemberPlugin);
});

jQuery(document).ready(function($) {
	$('#wpm-download-button-text').change(function(){
		$('a#wpm-download-example').text($('#wpm-download-button-text').val());
	});
	$('#wpm-button-size input').change(function(){
		size = $('#wpm-button-size input:checked').val();
		$('#wpm-download-example').removeClass('small');
		$('#wpm-download-example').removeClass('large');
		if( size != 'medium' ){
			$('#wpm-download-example').addClass(size);
		}
	});
	$('#wpm-button-text-color').change(function(){
		$('#wpm-download-example').css('color', $('#wpm-button-text-color').val()); 
	});
	$('#wpm-button-color').change(function(){
		$('#wpm-download-example').css('background', $('#wpm-button-color').val()); 
	});
				
	$.widget("ui.combobox", {
		_create: function() {
			var input = $("#wpm-download");
			self = this;
			value ='';
			input.addClass("ui-combobox-input").autocomplete({
				delay: 0,
				minLength: 0,
				source: function(req, response) {
					$.getJSON(ajaxurl + "?callback=?&action=wpmember-search-downloads", req, function(data) {		
						if( data.length === 0 ){
							data = [{
								id: 0,
								label: 'No downloads found',
							}]
						}
						response(data);
					});
				},
     				select: function(event, ui) {$('#wpm-download-id').val(ui.item.id);}
			}).addClass("ui-widget-content ui-corner-left")
			.data("autocomplete")._renderItem = function(ul, item) {
				if( item.id == 0 ){
					return $("<li></li>").data("item.autocomplete", item).append( item.label).appendTo(ul);
				}
				return $("<li></li>").data("item.autocomplete", item).append( "<a>"+item.label + "</br> <span style='font-size: 0.8em'><em>" + item.date+"</em></a>").appendTo(ul);
			};

			$("<a style='height:100%;margin:0px -1px;'>").attr("tabIndex", -1).attr("title", "Show All Items").insertAfter(input).button({
				icons: {
        	                	primary: "ui-icon-triangle-1-s"
        	            	},
        	           	 text: false
        	        }).removeClass("ui-corner-all").addClass("ui-corner-right ui-combobox-toggle").click(function() {
				// close if already visible
				if (input.autocomplete("widget").is(":visible")) {
					input.autocomplete("close");
        	        	        return;
				}
	
				// work around a bug (likely same cause as #5265)
				$(this).blur();

				// pass empty string as value to search for, displaying all results
				input.autocomplete("search", "");
				input.focus();
			});
		},
	});
	//Download selection
	$("#wpm-download").combobox();

	wpmColorPicker = {
		init : function(){
			$('.wpm-color-picker').each(function(index, el){
				a = $(el).val();
				$('#wpm-download-example').css('background', a); 
				if( $(el).attr('id') == 'wpm-button-color' ){
					$('#wpm-download-example').css('background', a); 
				}else{
					$('#wpm-download-example').css('color', a); 
				}				
			});
			$('.pickcolor').click(function(e) {
				cp_par = $(this).closest('.wpm-color-picker-container');
				colorPicker = $(cp_par).find('.colorPickerDiv');
				input = $(cp_par).find('.wpm-color-picker');
				$.farbtastic(colorPicker, function(a) { 
					$(input).val(a);
					if( $(input).attr('id') == 'wpm-button-color' ){
						$('#wpm-download-example').css('background', a); 
					}else{
						$('#wpm-download-example').css('color', a); 
					}
				});
				colorPicker.show();
				e.preventDefault();
				$(document).mousedown( function() { $(colorPicker).hide(); });
			});
		}
	}
	wpmColorPicker.init();
});
