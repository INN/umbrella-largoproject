<?php
/*
 Plugin Name: Business Directory Plugin - PayPal Gateway Module
 Plugin URI: http://www.businessdirectoryplugin.com
 Version: 1.4
 Author: Dave Rodenbaugh
 Description: Business Directory Payment Gateway for PayPal.  Allows you to collect payments from Business Directory Plugin listings via PayPal.
 Author URI: http://www.skylineconsult.com
 */

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// This module is not included in the core of Business Directory Plugin. It is a separate add-on premium module and is not subject
// to the terms of the GPL license  used in the core package
// This module cannot be redistributed or resold in any modified versions of the core Business Directory Plugin product
// If you have this module in your possession but did not purchase it via businessdirectoryplugin.com or otherwise obtain it through businessdirectoryplugin.com  
// please be aware that you have obtained it through unauthorized means and cannot be given technical support through businessdirectoryplugin.com.
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

class BusinessDirectory_PayPalGateway {

    const REQUIRED_BD_VERSION = '2.0.4';


    public function __construct() {
        add_action('admin_notices', array($this, '_admin_notices'));
        add_action('wpbdp_modules_init', array($this, '_bd_integration'));
    }

    private function check_requirements() {
        return function_exists('wpbdp_get_version') && version_compare(wpbdp_get_version(), self::REQUIRED_BD_VERSION, '>=');
    }

    public function _admin_notices() {
        if (!$this->check_requirements())
            echo sprintf('<div class="error"><p>Business Directory - PayPal Gateway Module requires Business Directory Plugin >= %s.</p></div>', self::REQUIRED_BD_VERSION);
    }

    public function _bd_integration() {
        $payments_api = wpbdp_payments_api();
        $payments_api->register_gateway('paypal', array(
            'name' => _x('PayPal', 'paypal-module', 'WPBDM'),
            'check_callback' => array($this, '_check_config'),
            'html_callback' => array($this, 'paypal_button'),
            'process_callback' => array($this, 'process_payment')
        ));
    }


    /* PayPal. */
    public function _check_config() {
        if (trim(wpbdp_get_option('paypal-business-email')) == '') {
            return array(_x('"Business Email" missing.', 'paypal-module', 'WPBDM'));
        }
    }

    public function paypal_button($transaction_id) {
    	$api = wpbdp_payments_api();
    	$transaction = $api->get_transaction($transaction_id);

    	$html = '';

    	$html .= sprintf('<form action="%s" method="POST">', $api->in_test_mode() ? 'https://www.sandbox.paypal.com/cgi-bin/webscr' : 'https://www.paypal.com/cgi-bin/webscr');
    	$html .= '<input type="hidden" name="cmd" value="_xclick" />';

    	if ($api->in_test_mode())
    		$html .= '<input type="hidden" name="test_ipn" value="1" />';

    	$item_name = '';
    	if ($transaction->payment_type == 'upgrade-to-sticky')
    		$item_name = sprintf(_x('Payment for upgrading to featured listing "%s" with listing ID: %s.', 'paypal-module', 'WPBDM'), get_the_title($transaction->listing_id), $transaction->listing_id);
    	else
    		$item_name = sprintf(_x('Payment for listing "%s" with listing ID: %s.', 'paypal-module', 'WPBDM'), get_the_title($transaction->listing_id), $transaction->listing_id);
    	$item_name = esc_attr($item_name);

    	$html .= sprintf('<input type="hidden" name="business" value="%s" />', wpbdp_get_option('paypal-business-email'));
		$html .= '<input type="hidden" name="no_shipping" value="1" />';
		$html .= sprintf('<input type="hidden" name="return" value="%s" />', $api->get_processing_url('paypal'));
		$html .= sprintf('<input type="hidden" name="notify_url" value="%s" />', $api->get_processing_url('paypal'));
		$html .= sprintf('<input type="hidden" name="cancel_return" value="%s" />', $api->get_processing_url('paypal'));		
		$html .= '<input type="hidden" name="no_note" value="1" />';
		$html .= '<input type="hidden" name="quantity" value="1" />';
		$html .= '<input type="hidden" name="rm" value="2" />';
		$html .= sprintf('<input type="hidden" name="item_name" value="%s" />', $item_name);
		$html .= sprintf('<input type="hidden" name="item_number" value="%s" />', $transaction->id);
		$html .= sprintf('<input type="hidden" name="amount" value="%s" />', number_format($transaction->amount, 2, '.', ''));
		$html .= sprintf('<input type="hidden" name="currency_code" value="%s" />', wpbdp_get_option('currency'));
		$html .= sprintf('<input type="hidden" name="custom" value="%s" />', $transaction->id);
		$html .= '<input type="hidden" name="src" value="1" />';
		$html .= '<input type="hidden" name="sra" value="1" />';
		$html .= sprintf('<input type="image" src="%s" border="0" name="submit" alt="%s" />',
						plugins_url('paypalbuynow.gif', __FILE__),
						_x("Make payments with PayPal - it's fast, free and secure!", 'paypal-module', 'WPBDM'));

    	$html .= '</form>';

    	return $html;
    }

    public function validate($args) {
    	$api = wpbdp_payments_api();

    	$req = 'cmd=_notify-validate';

    	foreach ($args as $key => $value) {
    		if ($key != 'cmd') {
    			$value = urlencode(stripslashes($value));
    			$req .= sprintf('&%s=%s', $key, $value);
    		}
    	}

		$use_curl = function_exists('curl_version') ? true : false;
		$url = $use_curl ? 'https://www.paypal.com/cgi-bin/webscr' : 'ssl://www.paypal.com';
		
		if ($api->in_test_mode())
			$url = $use_curl ? 'https://www.sandbox.paypal.com/cgi-bin/webscr' : 'ssl://www.sandbox.paypal.com';

		$reply = '';

		if ($use_curl) {
		    $cf = curl_init($url);
		    curl_setopt($cf, CURLOPT_POST, true);
		    curl_setopt($cf, CURLOPT_POSTFIELDS, $req);
		    curl_setopt($cf, CURLOPT_RETURNTRANSFER, true);
	        $reply = curl_exec($cf);
	        curl_close($cf);
		} else {
    		// post back to PayPal system to validate
	    	$header = "POST /cgi-bin/webscr HTTP/1.0\r\n";
	    	$header .= "Content-Type: application/x-www-form-urlencoded\r\n";
	    	$header .= "Content-Length: " . strlen($req) . "\r\n";
	    	$header.="Connection: close\r\n\r\n";
	    	$fp = fsockopen($url, 443, $errno, $errstr, 30);
	    	
	    	if ($fp) {
	    		fputs ($fp, $header . $req."\r\n\r\n");
	    		$headerdone = false;
	    			while(!feof($fp)) {
	    				$line=fgets($fp);
	    				if (strcmp($line,"\r\n")==0) {
	    					// read the header
	    					$headerdone = true;
	    				} elseif ($headerdone) {
	    					// header has been read. now read the contents
	    					$reply.=$line;
	    				}
	    			}

	    		fclose($fp);
	    		$reply = trim($reply);
	    	}
		}

		return $reply;
    }

    public function process_payment($args) {
    	$api = wpbdp_payments_api();

    	$reply = $this->validate($args);

    	if ($reply == 'VERIFIED') {
	    	if ($transaction = $api->get_transaction($args['custom'])) {
		    	$payerinfo = array('name' => 'unknown', 'email' => 'unknown');

                if ($transaction->status == 'pending') {
    		    	if (isset($args['first_name']))
    		    		$payerinfo['name'] = trim($args['first_name']);

    		    	if (isset($args['last_name']))
    		    		$payerinfo['name'] .= ' ' . trim($args['last_name']);

    		    	if (isset($args['payer_email']))
    		    		$payerinfo['email'] = $args['payer_email'];

    		    	$payment_status = $args['payment_status'];

    		    	$transaction->gateway = 'paypal';
    		    	$transaction->processed_by = 'gateway';
    		    	$transaction->processed_on = current_time('mysql');
    		    	$transaction->payerinfo = $payerinfo;
    		    	$transaction->extra_data['paypal_args'] = $args;

    				if(strcasecmp($payment_status, "Completed") == 0) {
    					$transaction->status = 'approved';
    				} elseif(strcasecmp($payment_status, "Refunded") == 0 || strcasecmp($payment_status, "Reversed") == 0 || strcasecmp ($payment_status, "Partially-Refunded") == 0) {
    					$transaction->status = 'rejected';
    				}

    				$api->save_transaction($transaction);
                }

				return $transaction->id;
	    	}
    	}

    	return 0;
    }

}

$bd_paypal_gateway = new BusinessDirectory_PayPalGateway();