(function($) {

        if( $('#wpm_reset_reg_defaults').length > 0) {
 
           $('#wpm_reset_reg_defaults').click(function (evt) {
 		evt.preventDefault();
 
                // Initiate a request to the server-side
                $.post(ajaxurl, {
                    action: 'wpmember-reset-registration-style',
                    _ajax_nonce: WPMemberReg.resetNonce
                }, 
		function (response) {
				if( response != '0' || response != '-1' ){
					for (x in response){
						$('input[name="wpmember['+x+']"]').val(response[x]);
					}
					wpmColorPicker.init();
				}
			},
		'json');
            });
        } // end if


wpmRegCustomiser = {
	init : function(){
		var t=this;
		 t.fields = wpmember.fields;
		t.count = t.fields.length;

		$(document).on("click", "a.add-select-option", function(e){
			e.preventDefault();
			current = $(this).closest('li');
			clone = current.clone();

			clone.find('input').keydown(function(e){
				id=$(this).closest('ul').attr('id').substring(13);
				if ( e.which == 13 ){
					e.preventDefault();
					wpmRegCustomiser.revert($(this));
				}
			}).val('').focus();
			current.after(clone);
		});

		$(document).on("click", "a.add-radio-option", function(e){
			e.preventDefault();
			current = $(this).closest('li');
			clone = current.clone();
			current.after(clone);
		});

		$(document).on("click", "a.remove-field-element, a.remove-radio-option, a.remove-select-option", function(e){
			e.preventDefault();
			$(this).closest('li').remove();
		})

		$(document).on('click', ".wpm-inline-edit",function(){
			var id=$(this).attr('id').substring(16);
			$(this).hide();
			container = $(this).closest('span.editable-contain');
			edit=$(container).find('.wpm-edit-box');
			edit.show().focus();
			$("#wpm_edit_box_"+id+",.wpm_edit_box_"+id).keydown(function(e){
				if ( e.which == 13 ){
					e.preventDefault();
					wpmRegCustomiser.revert($(this));
				}
			});
		});

		//Insert existing fields
		for (i=0; i< t.count; i++){

			field = t.fields[i];

			if( typeof field.type === "undefined" ){
				continue;
			}

			$( "#sortable" ).append('<li class="menu-item ui-draggable wpmember-form-element">'+wpmRegCustomiser.create_field(field,i+1)+'</li>');
		}
		wpmRegCustomiser.make_editable();


		//Create the sortable form
		$( "#sortable" ).sortable({
			revert: true,
			placeholder: "sortable-placeholder field-placeholder",
		   	receive: function(event, ui) { 
				dropped = $(this).data().sortable.currentItem;
				field_type = ui.sender.attr('id').substring(15) 
				t.count++;
				id = wpmRegCustomiser.get_unique_id('field_id_');
				field = {type:field_type, label:'Label click to edit', id:id};
				switch(field_type){
					case 'select':
						field.select = ['option 1', 'option 2'];
						break;
					case 'radio':
						field.option = ['option 1', 'option 2'];
						break;
					case 'terms_conditions':
						field.label = 'Terms & Conditions';
						break;
					case 'subscriptions':
						field.label = 'Subscription Options';
						break;
					case 'coupon':
						field.label = 'Coupon Code';
						break;
					case 'antispam':
						field.label = 'Anti-Spam Math question';
						break;
					case 'subscription_intro':
						field.label = '';
						break;
				}
				dropped.html(wpmRegCustomiser.create_field(field,t.count));
				dropped.addClass("wpmember-form-element");
				wpmRegCustomiser.make_editable();
			}
		});

		//Create the 'bin'. List of field types.
		$( "#wpmember_reg_cust_fields,#wpmember_reg_predefined_form_fields" ).droppable({
			revert: true,
			placeholder: "sortable-placeholder field-placeholder",
			hoverClass: "ui-state-active",
			  drop: function(event, ui) {
		            $(ui.draggable).remove();
		        },
			tolerance: "intersect",
		});

		//Double clicks adds field type to form
		$('#wpm_form_field_bin li').dblclick(function() {
			field_type = $(this).attr('id').substring(15);
			id = wpmRegCustomiser.get_unique_id('field_id_');
			field = {type:field_type, label:'Label click to edit', id: id};
				switch(field_type){
					case 'select':
						field.select = ['option 1', 'option 2'];
						break;
					case 'radio':
						field.option = ['option 1', 'option 2'];
						break;
					case 'terms_conditions':
						field.label = 'Terms & Conditions';
						break;
					case 'subscriptions':
						field.label = 'Subscription Options';
						break;
					case 'coupon':
						field.label = 'Coupon Code';
						break;
					case 'antispam':
						field.label = 'Anti-Spam Math question';
						break;
					case 'subscription_intro':
						field.label = '';
						break;
				}
			t.count++;
			$( "#sortable" ).append('<li class="menu-item ui-draggable wpmember-form-element">'+wpmRegCustomiser.create_field(field,t.count)+'</li>');
			wpmRegCustomiser.make_editable();
		});

		//Drag field types to form
		$( ".draggable" ).draggable({
			connectToSortable: "#sortable",
			helper: "clone",
			revert: "invalid"
		});

		//Fields can be dragged to 'bin' to be destroyed.
		$( ".draggable-form-element" ).draggable({
			connectToSortable: "#wpmember_reg_cust_fields",
			helper: "original",
			revert: true
		});

		//$( "ul, li" ).disableSelection();
	},

	revert: function(edit){
			container = edit.closest('span.editable-contain');
			editable= $(container).find('.wpm-editable-content');
			editableWrap= $(container).find('span.wpm-inline-edit');
			if(! editable.is('select')){
				editable.text(edit.val());
				edit.hide();
			}else{
				container.find('.wpm-edit-box').hide();
			}
			editableWrap.show();

		},

	get_unique_id: function(id){
		i=1;
		while( $('.wpm-element-id[value="'+id+i+'"] ').length >0 ){
			i++;
		}
		return id+i;
	},

	make_editable: function(){
				$('.wpmember-form-element').hover(function () {
					$(this).addClass("wpm-form-element-hover");
					$(this).find('.wpm-field-options').show();
				},
				function () {
					$(this).removeClass("wpm-form-element-hover");
					$(this).find('.wpm-field-options').hide();
				});

				$(".wpm-edit-box:input").blur(function(){
					wpmRegCustomiser.revert($(this));
				});
	},

	create_field: function(field, n_id){
		switch (field.type){
			case 'input':
				field_html= '<div style="width:190px;float: left;">'+wpmRegCustomiser.editable_content('label',field.label,n_id)+'</div>'
						+'<input type="text" value="" />'
					break;
			case 'date_input':
				field_html= '<div style="width:190px;float: left;">'+wpmRegCustomiser.editable_content('label',field.label,n_id)+'</div>'
						+'<input type="text" value="" />'
					break;
			case 'textarea':
			 	field_html= '<div style="width:190px;float: left;">'+wpmRegCustomiser.editable_content('label',field.label,n_id)+'</div>'
						+'<textarea style="vertical-align: top;"></textarea>';
					break;
			case 'checkbox':
			 	field_html= '<div style="width:190px;float: left;">'+wpmRegCustomiser.editable_content('label',field.label,n_id)+'</div>'
						+'<input type="checkbox" />';
					break;
			case 'radio':
			 	field_html= '<div style="width:190px;float: left;">'+wpmRegCustomiser.editable_content('label',field.label,n_id)+'</div>'
						+wpmRegCustomiser.editable_radio('option',field.label,n_id, field.option);
					break;
			case 'select':
				field_html= '<div style="width:190px;float: left;">'+wpmRegCustomiser.editable_content('label',field.label,n_id)+'</div>'
						+wpmRegCustomiser.editable_select('select',field.label,n_id, field.select);
					break
;
			//Pre-defined
			case 'subscriptions':
			case 'subscription_intro':
			case 'terms_conditions':
			case 'coupon':
			case 'antispam':
				return '<div style="width:190px;float: left;">'+field.label+'</div>'
					+'<input type="hidden" name="wpmember[form]['+n_id+'][type]" value ="'+field.type+'" />'
					+'<input type="hidden" name="wpmember[form]['+n_id+'][label]" value ="'+field.label+'" />'
					+'<div class="wpm-field-options"><a href="#" class="remove-field-element">remove</a></div>';
				break;

			default :
				return;
		}

		required = ( field.required == 1 ) ? 'checked="checked"' : ''

		return field_html+'<input type="hidden" name="wpmember[form]['+n_id+'][type]" value ="'+field.type+'" />'
		+'<div class="wpm-field-options">'
			+wpmRegCustomiser.editable_content('id',field.id,n_id)
			+'| <label> <input type="checkbox" value="1" name="wpmember[form]['+n_id+'][required]" '+required+' /> Required </label>'
			+'| <a href="#" class="remove-field-element">remove</a>'
		+'</div>';
	},


	editable_content: function(id,label, element_id){
		if( id == 'id' ){
			element_class ='wpm-edit-box wpm-element-id';
		}else{
			element_class ='wpm-edit-box';
		}
		html =  '<span class="editable-contain"><span class="wpm-inline-edit" id="wpm_inline_edit_'+element_id+''+id+'">'
					+'<span class="wpm-editable-content">'+label+'</span>'
					+'<img src="'+wpm_reg_custom.edit_img+'">'
				+'</span>'
				+'<input type="text" style="display:none" value="'+label+'" class="'+element_class+'" name="wpmember[form]['+element_id+']['+id+']" id="wpm_edit_box_'+element_id+''+id+'"/>'
				+'</span>'
		return html;
	},

	editable_select: function(id,label, element_id, options){
		html =	'<span class="editable-contain"><span class="wpm-inline-edit" id="wpm_inline_edit_'+element_id+''+id+'">'
					+'<select class="wpm-editable-content">'
						+'<option value="1"> option</option>'
						+'</select>'
					+'<img src="'+wpm_reg_custom.edit_img+'">'
				+'</span>'
				+'<ul class="wpm-edit-box" style="display:none" id="wpm_edit_box_'+element_id+''+id+'">';

		for (j=0; j< options.length; j++){
			html =html+'<li>'+wpmRegCustomiser.select_input(options[j],element_id,id)+'</li>';
		}
		html =html+'</ul></span>';
		return html;
	},

	editable_radio: function(id,label, element_id, options){
		html = '<ul style="display: inline-block;">';
		for (j=0; j< options.length; j++){
			html =html+'<li><input type="radio" />   '
				+'<span class="editable-contain">'
				+ '<span class="wpm-inline-edit" id="wpm_inline_edit_'+element_id+''+id+j+'">'
					+'<span class="wpm-editable-content">'+options[j]+'</span>'
					+'<img src="'+wpm_reg_custom.edit_img+'">'
				+'</span>'
				+'<input type="text" style="display:none" value="'+options[j]+'" class="wpm-element-id wpm-edit-box" name="wpmember[form]['+element_id+']['+id+'][]" id="wpm_edit_box_'+element_id+''+id+j+'"/>'
				+ '<a href="#" class="add-radio-option">add</a> | <a href="#" class="remove-radio-option">remove</a></li>'
				+'</span>';
		}
		html =html +'</ul>';
		return html;
	},
	
	select_input: function(value, element_id, id){
		return '<input type="text" value="'+value+'" class="wpm_edit_box_'+element_id+''+id+' regular-text" name="wpmember[form]['+element_id+']['+id+'][]"/>' 
				+ '<a href="#" class="add-select-option">add</a> | <a href="#" class="remove-select-option">remove</a>';
	}

}
wpmColorPicker = {
	init : function(){
		$('.wpm-color-picker').each(function(index, el){
			a = $(el).val();
			cp_eg = $(el).parent().find('.wpm-color-picker-example').css('background', a); 
		});

		$('.pickcolor').click(function(e) {
			cp_par = $(this).closest('.wpm-color-picker-container');
			colorPicker = $(cp_par).find('.colorPickerDiv');
			example = $(cp_par).find('.wpm-color-picker-example');
			input = $(cp_par).find('.wpm-color-picker');
			$.farbtastic(colorPicker, function(a) { 
				$(input).val(a)
				example.css('background', a); 
			});
			colorPicker.show();
			e.preventDefault();
			$(document).mousedown( function() { $(colorPicker).hide(); });
		});
	}
}
	
$(document).ready(function(){wpmRegCustomiser.init();wpmColorPicker.init();});
})(jQuery);
