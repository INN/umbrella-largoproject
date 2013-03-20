jQuery(document).ready(function($){
	$('.add-new-h2').click(function(e){
		e.preventDefault();
		tb_show('Add New Log',"#TB_inline?height=350&amp;width=500&amp;inlineId=wpmember-create-log",null);
	});

	$('#wpm_member').autocomplete({
		delay: 0,
		minLength: 2,
		source: function(req, response) {
			$.getJSON(ajaxurl + "?callback=?&action=wpmember-search-member", req, function(data) {
				if( data.length === 0 ){
					data = [{
						id: 0,
						user_login: 'No members found',
						user_email:''
					}]
				}
				response($.map(data, function(item) {
					item.label = item.user_login;
					
					return item;
				}));
			});
		},
		select: function(event, ui) {$('#wpm_member_id').val(ui.item.id);}
	}).addClass("ui-widget-content ui-corner-left");
	

	$('#wpm_member').data("autocomplete")._renderItem = function(ul, item) {
		if( item.id == 0 ){
			return $("<li></li>").data("item.autocomplete", item).append( item.label).appendTo(ul);
		}

		term = (this.term+'').replace(/([\\\.\+\*\?\[\^\]\$\(\)\{\}\=\!\<\>\|\:])/g, "\\$1");
		re = new RegExp( "(" + term+ ")" , 'gi' );
		item.label = item.label.replace( re, "<span style='font-weight:bold;'>$1</span>" );
		item.user_email = item.user_email.replace( re, "<span style='font-weight:bold;'>$1</span>" );
		return $("<li></li>").data("item.autocomplete", item).append( "<a>"+item.label + "</br> <span style='font-size: 0.8em'><em>" + item.user_email+"</em></a>").appendTo(ul);
	};
});
