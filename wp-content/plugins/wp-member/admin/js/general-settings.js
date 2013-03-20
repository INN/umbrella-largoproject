jQuery(document).ready(function($) {  
	if( $('.wpm-smtp-setting').length > 0 ){
		if( $('#email_mailer').val() == 'php'){
			$('.wpm-smtp-setting').parents("tr").hide();
		}
		$('#email_mailer').change(function(){
			if( $('#email_mailer').val() == 'php'){
				$('.wpm-smtp-setting').parents("tr").hide();
			}else{
				$('.wpm-smtp-setting').parents("tr").show();
			}

		});		
	}

/*
	Show both credential options to allow payments to go through standard gateway, and refunds to be made via EC.

	if( $('#paypal_gateway_switch').length > 0 ){
		$('#paypal_gateway_switch').change(function(){
			if( $('#paypal_gateway_switch input[type=radio]:checked').val() == 0 ){
				$('#paypal_email').parents('tr').hide();
				$('#wpm-gateway-check-paypal, #paypal_signature, #paypal_password, #paypal_user').parents('tr').show();
			}else{
				$('#paypal_email').parents('tr').show();
				$('#wpm-gateway-check-paypal, #paypal_signature, #paypal_password, #paypal_user').parents('tr').hide();
			}
		}).trigger('change');
	}
*/

	if( $('.wpm-credential-check').length>0 ){
		$('.wpm-credential-check').click(function(e){
			e.preventDefault();
			//Get the gateway from the ID of the button: #wpm-gateway-check-[gateway]
			var gateway = $(this).attr('id').substr(18);

			var credentials = {};
			//Except classes of form {gateway}-credential-{credential name}
			$("input[class^='"+gateway+"-credential-'], fieldset[class^='"+gateway+"-credential-']").each(function(){
				var cred_classes =  $(this).attr("class").split(' ');
				var N = cred_classes.length
				for( i=0; i<N; i++ ){
					credential_class = cred_classes[i].split('-credential-');
					if( credential_class[0] == gateway ){
						if ( value = $(this).find('input[type=radio]:checked').val() )
							credentials[credential_class[1]]= value;				
						else
							credentials[credential_class[1]]= $(this).val();
						break;
					}
				}
			});

			//Gather ajax parameters
			params = {
				action: 'wpmember-check-gateway-credentials',
				gateway: gateway,
				credentials: credentials,
			};

			//'Disable' button, reveal ajax loading spinner
			$(this).addClass('button-disabled').css( 'cursor', 'default' )
					.parent('p').find('.waiting').removeClass('ajax-loading');

			// make ajax request
			$.post( ajaxurl, params,
				function(r) {
					if( r.gateway && r.valid== true ){
						//Gateway credentials are valid
						var id ='wpm-gateway-check-'+r.gateway+'-message';
						$('#'+id).html('<p> <strong> Gateway credentials valid </strong></p>').removeClass('error').addClass('updated').fadeIn();
					}else if( r.gateway ){
						//Gateway credentials are invalid
						var id ='wpm-gateway-check-'+r.gateway+'-message';
						$('#'+id).html('<p> <strong> Gateway credentials invalid </strong></p>').removeClass('updated').addClass('error').fadeIn();
					}

					//Re-enable button and hide ajax loading spinner
					$('#'+'wpm-gateway-check-'+r.gateway).removeClass('button-disabled').css( 'cursor', 'pointer' )
																.parent('p').find('.waiting').addClass('ajax-loading');
			}, 'json');
		});
	}
});  
