google.load('visualization', '1', {packages: ['corechart']});
jQuery(document).ready(function($) { 

	var wpmember_chart_theme ={
			backgroundColor: { fill: 'none' },
			 colors:['#21759B','#54A8CD','#306074','#74B2CD','#0B4A65'],
			width:'100%', height:'auto'
	}

      function wpmember_piechart() {

		//Gather ajax parameters
		params = {
			action: 'wpmember-dashboard-graphs',
		};

		// make ajax request
		$.post( ajaxurl, params,
			function(r) {
				wpm_members_pie_chart = r.members_pie_chart;

			      // Create our data table out of JSON data loaded from server.
			      members_pie = new google.visualization.DataTable(wpm_members_pie_chart);
      
			        // Create and draw the visualization.
			        new google.visualization.PieChart(document.getElementById('visualization')).
			            draw(members_pie, {title:"",theme:wpmember_chart_theme});

				 wpmember_sales_bar(r.sales_bar);
			}
		, 'json');
      }

	function wpmember_sales_bar( sales_bar) {

		var sales_bar_mode =[{},{title: WPMemberDash.locale.revenuebysales,},{title: WPMemberDash.locale.salesbymonth,}];

		// Create our data table out of JSON data loaded from server.
		var data = new google.visualization.DataTable(sales_bar);
		var tabs = $(".wpm-sales-bar-view");

		var chart_view = 1;
		wpmember_draw_bar();

		 function wpmember_draw_bar() {

			bar_options= {
				title: sales_bar_mode[chart_view].title,
				theme: wpmember_chart_theme,
				 height: 300,			
				 hAxis: {title: "Month"}
			};

			if( chart_view == 1){
				bar_options.colors=['#21759B','#54A8CD','#306074','#74B2CD','#0B4A65'];
			}else{
				bar_options.colors=['#54A8CD','#306074','#74B2CD','#0B4A65','#21759B'];
			}
			
			wrapper = new google.visualization.ChartWrapper({
				chartType: 'ColumnChart',
				dataTable: data,
				options: bar_options,
				view:{'columns': [0, chart_view]},
				containerId: 'wpmember_sales_bar'
  			});
			  wrapper.draw();
		};

		tabs.click(function(e){
			e.preventDefault();
			if( !$(this).hasClass('wp-tab-active') ){
				tabs.removeClass('wp-tab-active');
				$(this).addClass('wp-tab-active');
				chart_view = parseInt($(this).attr('id').substr(19));
				wpmember_draw_bar();
			}
		});
	};

            google.setOnLoadCallback(wpmember_piechart);
});
