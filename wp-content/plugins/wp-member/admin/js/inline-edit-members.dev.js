(function($) {
inlineEditMember = {

	init : function(){
		var t = this, qeRow = $('#inline-edit'), bulkRow = $('#bulk-edit'); emailRow=$('#bulk-email');
		t.what = '#member-';

		//revert on escape or clicking cancel
		bulkRow.keyup(function(e){
			if (e.which == 27)
				return inlineEditMember.revert();
		});
		$('a.cancel', qeRow).click(function(){
			return inlineEditMember.revert();
		});

		//Save on enter or clicking save (quick edit triggers ajax)
		$('a.save', qeRow).click(function(){
			return inlineEditMember.save(this);
		});
		$('td', qeRow).keydown(function(e){
			if ( e.which == 13 )
				return inlineEditMember.save(this);
		});

		//Cancel bulk row edits
		$('a.cancel', bulkRow).click(function(){
			return inlineEditMember.revert();
		});

		//Cancel bulk row edits
		$('a.cancel', emailRow).click(function(){
			return inlineEditMember.revert();
		});

		// Trigger quick edit
		$('a.editinline').live('click', function(){
			inlineEditMember.edit(this);
			return false;
		});

		//On bulk actions drop-down selecting edit, trigger bulk edit
		$('#doaction, #doaction2').click(function(e){
			var n = $(this).attr('id').substr(2);
			if ( $('select[name="'+n+'"]').val() == 'edit' ) {
				e.preventDefault();
				t.setBulk();
			}else if ($('select[name="'+n+'"]').val() == 'email'  ){
				e.preventDefault();
				t.setEmail();
			} else if ( $('form#posts-filter tr.inline-editor').length > 0 ) {
				t.revert();
			}
		});

		//On filter, revert quick/bulk edit and remove action.
		$('#post-query-submit').mousedown(function(e){
			t.revert();
			$('select[name^="action"]').val('-1');
		});
	},

	toggle : function(el){
		var t = this;
		$(t.what+t.getId(el)).css('display') == 'none' ? t.revert() : t.edit(el);
	},

	setEmail : function(){
		var te = '', c = true;
		this.revert();

		//Show the bulk editor
		$('#bulk-email td').attr('colspan', $('.widefat:first thead th:visible').length);
		$('table.widefat tbody').prepend( $('#bulk-email') );
		$('#bulk-email').addClass('inline-editor').show();

		//Add the checked users to the edit list
		$('tbody th.check-column input[type="checkbox"]').each(function(i){
			if ( $(this).prop('checked') ) {
				c = false;
				var id = $(this).val(), theTitle;
				theTitle = $('#inline_'+id+' .username').text() || 'no-user-name';
				te += '<div id="ttleemail'+id+'"><a id="_'+id+'" class="ntdelbutton" title="click to remove">X</a>'+theTitle+'</div>';
			}
		});

		if ( c )
			return this.revert();

		$('#bulk-email-titles').html(te);

		//When a user is removed from the bulk edit list,uncheck them.
		$('#bulk-email-titles a').click(function(){
			var id = $(this).attr('id').substr(1);
			$('table.widefat input[value="' + id + '"]').prop('checked', false);
			$('#ttleemail'+id).remove();
		});

		$('html, body').animate( { scrollTop: 0 }, 'fast' );

		},

	setBulk : function(){
		var te = '', c = true;
		this.revert();

		//Hide the dates until selected by the dropd-down
		$("#wpmember_registration_date, #wpmember_expire_date").hide();

		//Show the bulk editor
		$('#bulk-edit td').attr('colspan', $('.widefat:first thead th:visible').length);
		$('table.widefat tbody').prepend( $('#bulk-edit') );
		$('#bulk-edit').addClass('inline-editor').show();

		//Add the checked users to the edit list
		$('tbody th.check-column input[type="checkbox"]').each(function(i){
			if ( $(this).prop('checked') ) {
				c = false;
				var id = $(this).val(), theTitle;
				theTitle = $('#inline_'+id+' .username').text() || 'no-user-name';
				te += '<div id="ttle'+id+'"><a id="_'+id+'" class="ntdelbutton" title="click to remove">X</a>'+theTitle+'</div>';
			}
		});

		if ( c )
			return this.revert();

		$('#bulk-titles').html(te);

		//When a user is removed from the bulk edit list,uncheck them.
		$('#bulk-titles a').click(function(){
			var id = $(this).attr('id').substr(1);
			$('table.widefat input[value="' + id + '"]').prop('checked', false);
			$('#ttle'+id).remove();
		});

		$("#wpmember_registration_date, #wpmember_expire_date", $('#bulk-edit')).datepicker({	
			dateFormat: 'yy-mm-dd',
			changeMonth: true,
			changeYear: true,
		});

		$('html, body').animate( { scrollTop: 0 }, 'fast' );
	},


	edit : function(id) {
		var t = this, fields, editRow, rowData, f;
		t.revert();

		//Get the member's ID
		if ( typeof(id) == 'object' )
			id = t.getId(id);

		fields = [ 'status','registration','expire'];

		// add the new blank row and format (i.e. alternative or not)
		editRow = $('#inline-edit').clone(true);
		$('td', editRow).attr('colspan', $('.widefat:first thead th:visible').length);

		if ( $(t.what+id).hasClass('alternate') )
			$(editRow).addClass('alternate');
		$(t.what+id).hide().after(editRow);

		// populate the data
		rowData = $('#inline_'+id);

		//Add the username - but this isn't editable
		$('.musername', editRow).text( $('.username', rowData).text() );

		for ( f = 0; f < fields.length; f++ ) {
			if( fields[f] == 'registration' || fields[f]  =='expire' ){
				$("#wpmember_"+fields[f]+"_date", editRow).datepicker({	
					dateFormat: 'yy-mm-dd',
					changeMonth: true,
					changeYear: true,
				});
			}
			$(':input[name="wpmember[' + fields[f] + ']"]', editRow).val( $('.'+fields[f], rowData).text() );
		}

		// membership level taxonomy
		$('.level', rowData).each(function(){
			var term_ids = $(this).text();
			if ( term_ids ) {
				$('ul.wmlevel-checklist :checkbox', editRow).val(term_ids.split(','));
			}
		});
		$(editRow).attr('id', 'edit-'+id).addClass('inline-editor').show();

		//GIve the username field the focus.
		$('.musername', editRow).focus();

		return false;
	},

	save : function(id) {
		var params, fields;

		if ( typeof(id) == 'object' )
			id = this.getId(id);

		//Show 'loading' icon
		$('table.widefat .inline-edit-save .waiting').show();

		//Gather ajax parameters
		params = {
			action: 'wpmember-member-inline-save',
			_ajax_nonce: wpmember._nonce,
			user_ID: id,
		};
		fields = $('#edit-'+id+' :input').serialize();
		params = fields + '&' + $.param(params);

		// make ajax request
		$.post( ajaxurl, params,
			function(r) {
				$('table.widefat .inline-edit-save .waiting').hide();
				if (r) {
					if ( -1 != r.indexOf('<tr') ) {
						$(inlineEditMember.what+id).remove();
						$('#edit-'+id).before(r).remove();
						$(inlineEditMember.what+id).hide().fadeIn();
					} else {
						r = r.replace( /<.[^<>]*?>/g, '' );
						$('#edit-'+id+' .inline-edit-save .error').html(r).show();
					}
				} else {
					$('#edit-'+id+' .inline-edit-save .error').html(inlineEditL10n.error).show();
				}
			}
		, 'html');
		return false;
	},

	revert : function(){
		var id = $('table.widefat tr.inline-editor').attr('id');

		if ( id ) {
			$('table.widefat .inline-edit-save .waiting').hide();

			if ( 'bulk-edit' == id ) {
				$('table.widefat #bulk-edit').removeClass('inline-editor').hide();
				$('#bulk-titles').html('');
				$('#inlineedit').append( $('#bulk-edit') );
			}else if ('bulk-email' == id ){
				$('table.widefat #bulk-email').removeClass('inline-editor').hide();
				$('#bulk-email-titles').html('');
				$('#inlineedit').append( $('#bulk-email') );
			} else {
				$('#'+id).remove();
				id = id.substr( id.lastIndexOf('-') + 1 );
				$(this.what+id).show();
			}
		}

		return false;
	},

	getId : function(o) {
		var id = $(o).closest('tr').attr('id'),
			parts = id.split('-');
		return parts[parts.length - 1];
	}
};

$(document).ready(function(){
	inlineEditMember.init();
	$('.add-new-h2').click(function(e){
		e.preventDefault();
		tb_show('Add New Member',"#TB_inline?height=430&amp;width=500&amp;inlineId=wpmember-create-member",null);
	});
});
})(jQuery);
