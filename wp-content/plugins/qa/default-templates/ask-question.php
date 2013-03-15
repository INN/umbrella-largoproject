<?php get_header(); ?>
<div id="content" class="stories span8" role="main">
<div id="qa-page-wrapper">
    <div id="qa-content-wrapper">
    <?php do_action( 'qa_before_content', 'ask-question' ); ?>

    <?php the_qa_menu(); ?>

    <div id="ask-question">
    <?php the_question_form(); ?>
    </div>

    <?php do_action( 'qa_after_content', 'ask-question' ); ?>
    </div>
</div><!--#qa-page-wrapper-->

</div>
<aside id="sidebar" class="span4">
<?php get_sidebar(); ?>
</aside>

<?php get_footer(); ?>

