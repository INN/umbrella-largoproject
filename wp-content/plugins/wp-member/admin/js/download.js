jQuery(document).ready(function($) {  
    if ($('#wpm_download_file_button').length > 0) {
        // Media Uploader
        window.formfield = '';
        $('#wpm_download_file_button').on('click', function (e) {
		e.preventDefault();

		window.formfield = $('#wpm_download_file');

		window.tbframe_interval = setInterval(function() {
			jQuery('#TB_iframeContent').contents().find('.savesend .button, #go_button').val(WPMDownload.use_this_file).end().find('#insert-gallery, .wp-post-thumbnail').hide();
    		}, 1000);

		window.send_to_editor = function(html) {
			var file_url = $('a', '<div>' + html + '</div>').attr('href');
			$('#wpm_download_file').val(file_url);  
			tb_remove();

		     //restore old send to editor function
		     window.send_to_editor = window.wpmember_restore_send_to_editor;
		}

		tb_show(WPMDownload.add_download, 'media-upload.php?post_id='+encodeURIComponent(WPMDownload.post_id)+'&TB_iframe=true', false);  
        });
        
    }
});
