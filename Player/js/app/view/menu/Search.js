/**
 * Copyright 2014, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 * */

(function (klynt) {
    klynt.Search = function (data) {

        var svg =
            '<svg version="1.1" baseProfile="basic" class="search-arrow"' +
            'xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:a="http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/"' +
            'x="0px" y="0px" width="9px" height="6px" viewBox="0 -0.2 9 6" overflow="visible" enable-background="new 0 -0.2 9 6"' +
            'xml:space="preserve">' +
            '<defs>' +
            '</defs>' +
            '<polygon class="klynt-tertiary-color-fill" points="4.5,5.8 0,0 9,0 "/>' +
            '</svg>';

        this._template =
            '<div class="search">' +
            '<p class="search-title klynt-secondary-color-50"><span class="search-title-number klynt-tertiary-color">0</span><span class="search_title_for"> {{resultWording}}</span><span>&nbsp;</span><span class="search-title-text">...</span></p>' +
            '<div class="nano-container search-height">' +
            '<div class="search-results nano-content">' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<input type="text" class="menu-search-item klynt-secondary-color klynt-secondary-bg-color-10 menu-search-item-active" name="search" placeholder="{{placeHolderWording}}"></input>' + svg;

        this._template_results = '<div class="search-result" data-id="{{id}}">' +
            '<img class="search-result-thumbnail" src="{{^thumbnail}}Player/css/player/img/thumbnail.jpg{{/thumbnail}}{{#thumbnail}}{{thumbnail}}{{/thumbnail}}"></img>' +
            '<div class="search-result-text klynt-secondary-color">' +
            '<div><h2 class="search-result-name klynt-secondary-color">{{title}}</h2><span class="search-result-duration klynt-tertiary-color">{{formattedDuration}}</span></div>' +
            '<p class="search-result-tags klynt-secondary-color">{{#changeTags}}{{tags}}{{/changeTags}}</p>' +
            '<p class="search-result-description">{{description}}</p>' +
            '<p class="search-result-content">{{#texts}}{{#changeContent}}{{rawContent}}{{/changeContent}}{{/texts}}</p>' +
            '</div>' +
            '</div>';

        klynt.MenuItem.call(this, data);
    };

    klynt.Search.prototype = {
        _$search_title_number: null,
        _$search_title_for: null,
        _$search_title_text: null,
        _$search_results: null,
        _$search_result: null,
        _results: null,
        _results_tag: null,
        _results_title: null,
        _results_text: null,
        _results_content: null,
        _search: null,
        _length: null,
        _old_results: []
    };

    klynt.Search.prototype.init = function () {
        klynt.MenuItem.prototype.init.call(this);
        this._$element.addClass('menu-search');
    };

    klynt.Search.prototype.render = function () {
        klynt.MenuItem.prototype.render.call(this);
        this._$search_title_number = this.$element.find('.search-title-number');
        this._$search_title_for = this.$element.find('.search_title_for');
        this._$search_title_text = this.$element.find('.search-title-text');
        this._$search_results = this.$element.find('.search-results');
        // $('.menu-search-item').on('keyup change', this.lookFor.bind(this));
        this.$element.find('.menu-search-item').on('keyup change', this.lookFor.bind(this));
    };

    klynt.Search.prototype.update = function () {
        klynt.MenuItem.prototype.update.call(this);
    };

    klynt.Search.prototype.lookFor = function () {

        this._$element.find('.search-title').show();

        this._$search_result = $('.search-result');
        this._search = $('.menu-search-item').val();
        this._length = this._search.length;

        switch (this._length) {
        case 0:
            this._$search_title_text.text(this._search + '...');
            break;
        case 1:
            this._$search_title_text.text(this._search + '..');
            break;
        case 2:
            this._$search_title_text.text(this._search + '.');
            break;
        default:
            this._$search_title_text.text(this._search);
        }

        if (this._length > 2) {
            this._results_title = klynt.metadata.findSequencesByTitle(this._search);
            this._results_tag = klynt.metadata.findSequencesByTag(this._search);
            this._results_text = klynt.metadata.findSequencesByText(this._search);
            this._results_content = klynt.metadata.findSequencesByContent(this._search);
            this._results = this._results_title.concat(this._results_tag, this._results_text, this._results_content);
            if (this._results.length > 0) {
                this._results = this.delete_doublons(this._results);
                this.display_results(this._results);
                this.show_searched_elements();
            } else {
                this._$search_result.remove();
                this._$search_title_number.text('0');
                this._$search_title_for.html(this._data.resultWording);
                this._old_results = [];
            }
        } else {
            this._$search_result.remove();
            this._$search_title_number.text('0');
            this._$search_title_for.html(this._data.resultWording);
            this._old_results = [];
        }

    };

    klynt.Search.prototype.display_results = function (results) {
        var to_compare, to_add, to_del;

        if (this._old_results.length > 0) {
            to_compare = this.compare(this._old_results, results);
            to_add = to_compare['add'];
            to_del = to_compare['del'];
            if ((to_add.length != 0) || (to_del.length != 0)) {
                if (to_add.length != 0) {
                    to_add.forEach(function (x) {
                        this.display_result(x);
                    }.bind(this));
                }
                if (to_del.length != 0) {
                    to_del.forEach(function (x) {
                        this._$search_result.remove('[data-id="' + x + '"]');
                    }.bind(this));
                }
                new_length = $('.search-result').length;
                if (new_length > 1) {
                    this._$search_title_for.html(this._data.resultsWording);
                } else {
                    this._$search_title_for.html(this._data.resultWording);
                }
                this._$search_title_number.text(new_length);
            }
        } else {

            if (results.length > 1) {
                this._$search_title_for.html(this._data.resultsWording);
            } else {
                this._$search_title_for.html(this._data.resultWording);
            }

            this._$search_title_number.text(results.length);
            results.filter(this.display_result.bind(this));
        }

        this._old_results = results;

    };

    klynt.Search.prototype.display_result = function (result) {
        var pattern = new RegExp(this._search, 'gi');

        result.changeTags = function () {
            return function (text, render) {

                if (render(text) == '') {
                    return '';
                } else {
                    return '#' + render(text).replace(/,/g, ' #');
                }

            };
        };

        result.changeContent = function () {
            return function (text, render) {
                var return_text = '';
                text = render(text);
                text_array = text.split(' ');
                for (var i = 0; i < text_array.length; i++) {
                    match = text_array[i].match(pattern)
                    if (match) {
                        return_text += '"';
                        if (text_array[i - 1]) {
                            return_text += text_array[i - 1] + ' ';
                        }
                        return_text += text_array[i] + ' ';
                        if (text_array[i + 1]) {
                            return_text += text_array[i + 1] + ' ';
                        }
                        return_text += '"';
                        return_text += ' ';
                    }
                }
                return return_text;
            };
        };

        $('.search-results').append(Mustache.render(this._template_results, result));
        this.show_searched_elements();

        setTimeout(function () {
            $('.nano-container').nanoScroller({
                paneClass: 'nano-pane',
                contentClass: 'nano-content'
            });
        }, 0);

        this.$element.find('.search-result-thumbnail, .search-result-name').unbind();

        this.$element.find('.search-result-thumbnail').click(function () {

            var id = $(this).parent().data('id');
            openSequence(id);

        });

        this.$element.find('.search-result-name').click(function () {

            var id = $(this).parent().parent().parent().data('id');
            openSequence(id);

        });

        function openSequence(id) {

            klynt.menu.searchButton(false);
            klynt.menu.close();
            $('.footer-item').removeClass('active');
            setTimeout(function () {
                klynt.sequenceManager.open(id);
            }, 500);
        }
    };

    klynt.Search.prototype.show_searched_elements = function () {

        var search = this._search;
        var elts = $('.search-result-name,.search-result-tags,.search-result-description,.search-result-content');
        var reg = new RegExp('(' + search + ')', 'gi');
        var reg2 = new RegExp('(#)', 'gi');
        var text, new_text;

        elts.each(function () {
            text = $(this).text();
            new_text = text.replace(reg, '<span class="klynt-tertiary-color-bg-alpha35">$1</span>');

            if ($(this).attr('class').indexOf('search-result-tags') != -1) {
                new_text = new_text.replace(reg2, '<span class="klynt-tertiary-color">$1</span>');
            }

            $(this).html(new_text);
        })

    };

    klynt.Search.prototype.delete_doublons = function (tab) {

        var new_tab = [];
        var ids = [];
        var test_id;
        tab.forEach(function (entry) {
            test_id = ids.indexOf(entry.id);
            if (test_id < 0) {
                new_tab.push(entry);
                ids.push(entry.id);
            }
        });

        return new_tab;
    };

    klynt.Search.prototype.compare = function (old_results, new_results) {
        var keep_results = [];
        var to_add = [];
        var to_delete = [];
        var test = true;

        old_results.map(function (old_result) {
            new_results.map(function (new_result) {
                if (old_result.id == new_result.id) {
                    keep_results.push(old_result);
                }
            });
        });

        new_results.map(function (new_result) {
            test = true;
            keep_results.map(function (keep_result) {
                if (new_result.id == keep_result.id) {
                    test = false;
                }
            });
            if (test) {
                to_add.push(new_result);
            }
        });

        old_results.map(function (old_result) {
            test = true;
            keep_results.map(function (keep_result) {
                if (old_result.id == keep_result.id) {
                    test = false;
                }
            });
            if (test) {
                to_delete.push(old_result.id);
            }
        });

        return {
            add: to_add,
            del: to_delete
        };
    };

    klynt.Search.prototype = klynt.utils.mergePrototypes(klynt.MenuItem, klynt.Search);
})(window.klynt);