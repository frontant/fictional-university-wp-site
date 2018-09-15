import $ from 'jquery';

class Search {
    constructor() {
        this.openButton = $(".js-search-trigger");
        this.closeButton = $(".search-overlay__close");
        this.searchOverlay = $(".search-overlay");
        this.searchField = $("#search-term");
        this.resultsDiv = $("#search-overlay__results");
        this.isOverlayOpen = false;
        this.isSpinnerVisible = false;
        this.typingTimer;
        this.previousValue;

        this.events();
    }

    events() {
        this.openButton.on("click", this.openOverlay.bind(this));
        this.closeButton.on("click", this.closeOverlay.bind(this));
        $(document).on("keydown", this.keyPressDispatcher.bind(this));
        this.searchField.on("keyup", this.typingLogic.bind(this));
    }

    openOverlay() {
        this.searchField.val('');
        this.resultsDiv.html('');

        this.searchOverlay.addClass("search-overlay--active");
        $("body").addClass("body-no-scroll");

        // set focus to the search field
        setTimeout(() => {
            this.searchField.focus();
        }, 300);

        this.isOverlayOpen = true;
    }

    closeOverlay() {
        // unfocus the search field
        this.searchField.blur();

        this.searchOverlay.removeClass("search-overlay--active");
        $("body").removeClass("body-no-scroll");

        this.isOverlayOpen = false;
    }

    keyPressDispatcher(e) {
        if (e.keyCode === 83 && !this.isOverlayOpen && !$("input, textarea").is(":focus")) {
            this.openOverlay();
        } else if (e.keyCode === 27 && this.isOverlayOpen) {
            this.closeOverlay();
        }
    }

    typingLogic() {
        var currentValue = this.searchField.val();

        if (this.previousValue !== currentValue) {
            clearTimeout(this.typingTimer);

            if (currentValue) {
                if (!this.isSpinnerVisible) {
                    this.resultsDiv.html('<div class="spinner-loader"></div>');
                    this.isSpinnerVisible = true;
                }
                this.typingTimer = setTimeout(this.getResults.bind(this), 800);
            } else {
                this.resultsDiv.html('');
                this.isSpinnerVisible = false;
            }
        }

        this.previousValue = currentValue;
    }

    getResults() {
        var searchStr = this.searchField.val();
        var postsUrl = universityData.root_url + '/wp-json/wp/v2/posts?search=' + searchStr;
        var pagesUrl = universityData.root_url + '/wp-json/wp/v2/pages?search=' + searchStr;

        $.when($.getJSON(postsUrl),
                $.getJSON(pagesUrl)
                ).then((posts, pages) => {
            var results = posts[0].concat(pages[0]);
            var html =
                    '<h2 class="search-overlay__section-title">General Information</h2>' +
                    (results.length ? '<ul class="min-list link-list">' : '<p>No general information matches that search.</p>') +
                    results.map(item => '<li><a href="' + item.link + '">' + item.title.rendered + '</a>' + (item.type === 'post' ? ' by ' + item.authorName : '') + '</li>\n').join('') +
                    (results.length ? '</ul>' : '');


            this.resultsDiv.html(html);
        }, () => {
            this.resultsDiv.html('<p>Unexpected error, please try again.</p>');
        });

        this.isSpinnerVisible = false;
    }
}

export default Search;