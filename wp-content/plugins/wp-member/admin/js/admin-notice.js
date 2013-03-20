(function ($) {
    $(function () {
        // Check to see if the Ajax Notification is visible
        if ($('.wpm-ajax-notice').length > 0) {
 
            // If so, we need to setup an event handler to trigger it's dismissal
            $('.wpm-ajax-notice .wpm-ajax-dismiss').click(function (evt) {
 		evt.preventDefault();
 
                // Initiate a request to the server-side
                $.post(ajaxurl, {
                    action: 'wpmember-dismiss-notice',
                    _ajax_nonce: WPMemberNotice.nonce
                }, function (response) {
                    // If the response was successful (that is, 1 was returned), hide the notification;
                    if ('1' === response) {
                        $('.wpm-ajax-notice').fadeOut('slow');
                    }
                });
            });
        } // end if
    });
}(jQuery));
