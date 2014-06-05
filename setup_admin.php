<?php

/* Set your user info here */

$USERNAME='rnagle';
$PASSWORD='password';
$EMAIL='ryan@investigativenewsnetwork.org';

/* ------------- */

$_SERVER["HTTP_HOST"] = 'vagrant.dev';
$_SERVER["SERVER_NAME"] = 'vagrant.dev';
$_SERVER["REQUEST_METHOD"] = "GET";
if ( empty( $_SERVER["REQUEST_URI"] ) )
  $_SERVER["REQUEST_URI"] = "/cli";

# Don't try to process this like a request
define('WP_USE_THEMES', false);


if ( ! defined('WP_SITEURL') )
    define( 'WP_SITEURL', "http://vagrant.dev");

if ( file_exists('wp-config.php') )
	require_once('wp-config.php');

require_once('wp-admin/includes/ms.php');

$user = get_user_by('email', $EMAIL);

if (!empty($user)) {
	$ret = wp_set_password($PASSWORD, $user->ID);
	print "Set user password for " . $user->user_login . " to '$PASSWORD'\n";
	$ret = wp_update_user(array('ID' => $user->ID, 'role' => 'administrator'));
	if (!is_wp_error($ret))
		print "Successfully made user an admin!\n";
} else {
	print "Unable to find that user. Trying to create...\n";
	$ret = wp_create_user($USERNAME, $PASSWORD, $EMAIL);
	if (!is_wp_error($ret)) {
		print "Successfully created a new user!\n";
		$ret = wp_update_user(array('ID' => $ret, 'role' => 'administrator'));
		if (!is_wp_error($ret))
			print "Successfully made user an admin!\n";
	}
}

if (is_multisite()) {
	$ret = grant_super_admin($user->ID);
	if ($ret)
		print "Successfully made user '" . $user->user_login . "' a network admin\n";
}
