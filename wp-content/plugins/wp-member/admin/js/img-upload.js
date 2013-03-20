jQuery(document).ready(function($) {  
	$('.wpmember-upload-button').click(function() {  
		window.wpmember_restore_send_to_editor = window.send_to_editor;

		btn_id = $(this).attr('id');
		var input_id = btn_id.substring(0, btn_id.length - 11);

		window.send_to_editor = function(html) {
			var image_url = $('img',html).attr('src');  
			$('#'+input_id).val(image_url);  
			$('#'+input_id+'_preview').attr('src',image_url);  
			tb_remove();

		     //restore old send to editor function
		     window.send_to_editor = window.wpmember_restore_send_to_editor;
		}
		//var post_id=0;

		tb_show('Upload a logo', 'media-upload.php?post_id=0&context=wpmember-settings&context_id='+encodeURIComponent(input_id)+'&type=image&TB_iframe=true', false);  
		return false;  
	});  
});  
