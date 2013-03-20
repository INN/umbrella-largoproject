jQuery(document).ready(function($) {
	var dates = $(".wpm-date-input").datepicker({
			dateFormat: 'yy-mm-dd',
			changeMonth: true,
			changeYear: true,
			monthNamesShort: WPMember.locale.monthAbbrev,
			dayNamesMin: WPMember.locale.dayAbbrev,
			firstDay:  parseInt(WPMember.startday),
		});
	$('#wpm_packages input[name="wpmember[subscription]"]').change(function(){
		//Hide (or show) gateways if a free (resp. paid) package is selected
		if( $('#wpm_packages input[name="wpmember[subscription]"]:checked').hasClass('wpm-free-package') ){
			$('#wpm_gateways').hide();
		}else{
			$('#wpm_gateways').show();
		}
		//Hide (or show) Google Checkout gateway if it cannot (or can) be used
		if( $('#wpm_packages input[name="wpmember[subscription]"]:checked').hasClass('wpm-hide-google-if-selected') ){
			$('#gateway-google').parents('label').hide();
			$('#gateway-google').prop('checked', false);
		}else{
			$('#gateway-google').parents('label').show();
		}
	});
	
});

