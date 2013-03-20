<?php
/*
Plugin Name: WP-Member
Plugin URI: http://wp-member.com
Description: Advanced WordPress membership, user and content plugin.
Version: 4.0.32
Author: SmartMediaPro.com
Author URI: http://smartmediapro.com
*/

/*  Copyright 2012 WP-Member.com  (email : info@wp-member.com)

Support
For all your support needs, please visit our support page located here http://smartmediapro.com/support/

Liability
We accept no responsibility for any damage to your blog when using WP-Member. It is your responsibility to keep a regular backup of your database and files so that if the worst does happen, you can use your backup to bring your blog back online.
For full terms, please visit the following page: http://smartmediapro.com/terms-conditions/
*/

define('WPMEMBER_PLUGIN_URL',plugin_dir_url(__FILE__ ));
define('WPMEMBER_PLUGIN_PATH',plugin_dir_path(__FILE__ ));
define('WPMEMBER_PLUGIN_DB_VERSION','3');

define('WPMEMBER_URL_AFFILIATES', 'http://smartmediapro.com/affiliate/');
define('WPMEMBER_URL_DOCS', 'http://smartmediapro.com/support/');
define('WPMEMBER_URL_SUPPORT', 'http://smartmediapro.com/support/');
define('WPMEMBER_URL_STORE', 'http://smartmediapro.com/products-and-services/');
define('WPMEMBER_UPDATE_LISTENER', 'http://wp-member.com/');

/* Install, activation & deactivation */
require_once(WPMEMBER_PLUGIN_PATH .'includes/install.php');
register_activation_hook(__FILE__,'wpmember_install'); 
register_deactivation_hook( __FILE__, 'wpmember_deactivate' );
register_uninstall_hook( __FILE__,'wpmember_uninstall');

include(WPMEMBER_PLUGIN_PATH.'wp-member-main.php');
