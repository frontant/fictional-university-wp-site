<!DOCTYPE html>
<html>
    <head <?php language_attributes(); ?>>
        <meta name="charset" content="<?php bloginfo('charset'); ?>">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <?php wp_head(); ?>
    </head>
    <body <?php body_class(); ?>>
        <header class="site-header">
            <div class="container">
                <h1 class="school-logo-text float-left"><a href="<?php echo esc_url(site_url()); ?>"><strong>Fictional</strong> University</a></h1>
                <a href="<?php echo esc_url(site_url('/search')); ?>" class="js-search-trigger site-header__search-trigger"><i class="fa fa-search" aria-hidden="true"></i></a href="<?php echo esc_url(site_url('/search')); ?>">
                <i class="site-header__menu-trigger fa fa-bars" aria-hidden="true"></i>
                <div class="site-header__menu group">
                    <nav class="main-navigation">
                        <ul>
                            <?php
                            $navMenuId = get_nav_menu_locations()['headerMenuLocation'];
                            $navMenuItems = wp_get_nav_menu_items($navMenuId);

                            if ($navMenuItems) {
                                $pageId = get_queried_object_id();
                                $pageParentId = wp_get_post_parent_id(0);
                                $postPageId = get_option('page_for_posts');

                                foreach ($navMenuItems as $menuItem) {
                                    $isPage = $pageId == $menuItem->object_id;
                                    $isChildPage = $pageParentId == $menuItem->object_id;
                                    $isPost = $postPageId == $menuItem->object_id &&
                                            get_post_type() == 'post';
                                    $isEvent = basename(get_post_type_archive_link('event')) == basename($menuItem->url) &&
                                            (get_post_type() == 'event' or is_page('past-events'));
                                    $isProgram = basename(get_post_type_archive_link('program')) == basename($menuItem->url) &&
                                            get_post_type() == 'program';
                                    $isCampus = basename(get_post_type_archive_link('campus')) == basename($menuItem->url) &&
                                            get_post_type() == 'campus';

                                    $class = ($isPage or
                                            $isChildPage or
                                            $isPost or
                                            $isEvent or
                                            $isProgram or
                                            $isCampus) ? 'class="current-menu-item"' : '';
                                    echo '<li ' . $class . '><a href="' . $menuItem->url . '">' . $menuItem->title . '</a></li>';
                                }
                            }
                            ?>
                        </ul>
                        <!--
                        <ul>
                            <li <?php if (is_page('about-us') or wp_get_post_parent_id(0) == 17) echo 'class="current-menu-item"'; ?>><a href="<?php echo esc_url(site_url('/about-us')); ?>">About Us</a></li>
                            <li><a href="#">Programs</a></li>
                            <li <?php if (get_post_type() == 'event') echo 'class="current-menu-item"'; ?>><a href="<?php echo get_post_type_archive_link('event'); ?>">Events</a></li>
                            <li><a href="#">Campuses</a></li>
                            <li <?php if (get_post_type() == 'post') echo 'class="current-menu-item"'; ?>><a href="<?php echo esc_url(site_url('/blog')); ?>">Blog</a></li>
                        </ul>
                        -->
                    </nav>
                    <div class="site-header__util">
                        <?php if(is_user_logged_in()){?>
                            <a href="<?php echo wp_logout_url(); ?>" class="btn btn--small  btn--dark-orange float-left btn--with-photo">
                                <span class="site-header__avatar"><?php echo get_avatar(get_current_user_id(), 60); ?></span>
                                <span class="btn__text">Log Out</span>
                            </a>
                        <?php }else{?>
                            <a href="<?php echo wp_login_url(); ?>" class="btn btn--small btn--orange float-left push-right">Login</a>
                            <a href="<?php echo wp_registration_url(); ?>" class="btn btn--small  btn--dark-orange float-left">Sign Up</a>
                        <?php }?>
                        <a href="<?php echo esc_url(site_url('/search')); ?>" class="search-trigger js-search-trigger"><i class="fa fa-search" aria-hidden="true"></i></a href="<?php echo esc_url(site_url('/search')); ?>">
                    </div>
                </div>
            </div>
        </header>