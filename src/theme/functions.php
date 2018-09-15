<?php
require get_theme_file_path('/inc/search-route.php');

function pageBanner($inArgs = []) {
    if (!$inArgs['title']) {
        $inArgs['title'] = get_the_title();
    }

    if (!$inArgs['subtitle']) {
        $inArgs['subtitle'] = get_field('page_banner_subtitle');
    }

    if (!$inArgs['photo']) {
        $imageField = get_field('page_banner_background_image');
        if ($imageField) {
            $inArgs['photo'] = $imageField['sizes']['pageBanner'];
        } else {
            $inArgs['photo'] = get_theme_file_uri('/images/ocean.jpg');
        }
    }
    ?>

    <div class="page-banner">
        <div class="page-banner__bg-image" style="background-image: url(<?php echo $inArgs['photo']; ?>);"></div>
        <div class="page-banner__content container container--narrow">
            <h1 class="page-banner__title"><?php echo $inArgs['title']; ?></h1>
            <div class="page-banner__intro">
                <p><?php echo $inArgs['subtitle']; ?></p>
            </div>
        </div>  
    </div>
    <?php
}

function university_files() {
    wp_enqueue_script('googleMap', '//maps.googleapis.com/maps/api/js?key=AIzaSyCJKQjSNQVxEUAJEcb0sDNRtJL_lkZwtwI', NULL, '1.0', true);
    wp_enqueue_script('main-script', get_theme_file_uri('/js/scripts-bundled.js'), NULL, '1.0', true);
    wp_enqueue_style('custom-google-fonts', '//fonts.googleapis.com/css?family=Roboto+Condensed:300,300i,400,400i,700,700i|Roboto:100,300,400,400i,700,700i');
    wp_enqueue_style('fonts-awsome', '//maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css');
    wp_enqueue_style('main-styles', get_stylesheet_uri());
    wp_localize_script('main-script', 'universityData', array(
        'root_url' => get_site_url()
    ));
}

add_action('wp_enqueue_scripts', 'university_files');

function university_features() {
    register_nav_menu('headerMenuLocation', 'Header Menu Location');
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_image_size('professorLandscape', 400, 260, true);
    add_image_size('professorPortrait', 480, 650, true);
    add_image_size('pageBanner', 1500, 350, true);
}

add_action('after_setup_theme', 'university_features');

function university_adjust_queries($query) {
    // Query for Events
    if (!is_admin() AND is_post_type_archive('event') AND $query->is_main_query()) {
        $today = date('Ymd');

        $query->set('meta_key', 'event_date');
        $query->set('orderby', 'meta_value_num');
        $query->set('order', 'ASC');
        $query->set('meta_query', array(
            array(
                'key' => 'event_date',
                'compare' => '>=',
                'value' => $today,
                'type' => 'numeric')
        ));
    }

    // Query for Program
    if (!is_admin() AND is_post_type_archive('program') AND $query->is_main_query()) {
        $query->set('orderby', 'title');
        $query->set('order', 'ASC');
        $query->set('posts_per_page', -1);
    }

    // Query for Campus
    if (!is_admin() AND is_post_type_archive('campus') AND $query->is_main_query()) {
        $query->set('posts_per_page', -1);
    }
}

add_action('pre_get_posts', 'university_adjust_queries');

function universityMapKey($api) {
    $api['key'] = 'AIzaSyCJKQjSNQVxEUAJEcb0sDNRtJL_lkZwtwI';
    return $api;
}

add_filter('acf/fields/google_map/api', 'universityMapKey');

function university_custom_rest() {
    register_rest_field('post', 'authorName', array(
        'get_callback' => function() {
            return get_the_author();
        }
    ));
}

add_action('rest_api_init', 'university_custom_rest');
?>