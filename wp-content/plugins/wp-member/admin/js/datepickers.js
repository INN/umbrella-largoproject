jQuery(document).ready(function($) {
	var dates = $("#wpmember_registration_date, #wpmember_expire_date, .wpm-date-input" ).datepicker({
			dateFormat: 'yy-mm-dd',
			changeMonth: true,
			changeYear: true,
			monthNamesShort: WPMemberDP.locale.monthAbbrev,
			dayNamesMin: WPMemberDP.locale.dayAbbrev,
			firstDay:  parseInt(WPMemberDP.startday),
			onSelect: function( selectedDate ) {
				var option = this.id == "wpmember_registration_date" ? "minDate" : "maxDate",
					instance = $( this ).data( "datepicker" ),
					date = $.datepicker.parseDate(
						instance.settings.dateFormat ||
						$.datepicker._defaults.dateFormat,
						selectedDate, instance.settings );
				dates.not( '#'+this.id+', .wpm-date-input' ).datepicker( "option", option, date );
			}
		});

});

