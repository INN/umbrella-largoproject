<?php
global $user_ID, $post;
get_header();
?>
<div id="content" class="stories span8" role="main">
<div id="qa-page-wrapper">
	<div id="qa-content-wrapper">
	<?php do_action( 'qa_before_content', 'single-question' ); ?>

	<?php the_qa_menu(); ?>

	<?php if ( $user_ID == 0  || current_user_can( 'read_questions' ) ) { ?>
	<?php wp_reset_postdata(); ?>
	<div id="single-question">
		<h1 class="entry-title"><?php the_title(); ?></h1>
		<div id="single-question-container">
			<?php the_question_voting(); ?>
			<div id="question-body">
				<div id="question-content"><?php echo the_content(); ?></div>
				<?php the_question_category(  __( 'Category:', QA_TEXTDOMAIN ) . ' <span class="question-category">', '', '</span>' ); ?>
				<?php the_question_tags( __( 'Tags:', QA_TEXTDOMAIN ) . ' <span class="question-tags">', ' ', '</span>' ); ?>
				<span id="qa-lastaction"><?php _e( 'asked', QA_TEXTDOMAIN ); ?> <?php the_qa_time( get_the_ID() ); ?></span>

				<div class="question-meta">
					<?php do_action( 'qa_before_question_meta' ); ?>

					<?php the_qa_action_links( get_the_ID() ); ?>
					<?php the_qa_author_box( get_the_ID() ); ?>

					<?php do_action( 'qa_after_question_meta' ); ?>
				</div>
			</div>
		</div>
	</div>
	<?php } ?>

	<?php if ( (( ($user_ID == 0 && qa_visitor_can('read_answers')) || current_user_can( 'read_answers' )) ) && is_question_answered() ) { ?>
	<div id="answer-list">
		<?php do_action( 'qa_before_answers' ); ?>

		<h3><?php the_answer_count(); ?></h3>
		<?php the_answer_list(); ?>

		<?php do_action( 'qa_after_answers' ); ?>
	</div>
	<?php } ?>
	<?php if ( ($user_ID == 0 && qa_visitor_can('publish_answers')) || current_user_can( 'publish_answers' ) ) { ?>
	<div id="edit-answer">
		<?php do_action( 'qa_before_edit_answer' ); ?>

		<h3><?php _e( 'Your Answer', QA_TEXTDOMAIN ); ?></h3>
		<?php the_answer_form(); ?>

		<?php do_action( 'qa_after_edit_answer' ); ?>
	</div>
	<?php } ?>

	<?php do_action( 'qa_after_content', 'single-question' ); ?>
	</div>
</div><!--#qa-page-wrapper-->
</div>

<aside id="sidebar" class="span4">
<?php get_sidebar(); ?>
</aside>

<?php get_footer( 'question' ); ?>

