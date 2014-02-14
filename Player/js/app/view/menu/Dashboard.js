/**
 * Copyright 2014, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 * */

(function (klynt) {
    klynt.Dashboard = function (data) {
        this._template =
            '{{#showTags}}<div class="dashboard-tags">' +
            '<div class="dashboard-tags-wrapper nano">' +
            '<div class="content">' +
            '<div class="tags-title klynt-secondary-color-80"><strong class="figure klynt-tertiary-color">{{tags.length}}</strong> {{#wording}}keywords{{/wording}}</div>' +
            '{{> tags-list}}' +
            '</div>' +
            '</div>' +
            '</div>{{/showTags}}' +
            '<div class="dashboard-wrapper">' +
            '<div class="dashboard-gauge">' +
        //     '<svg viewBox="0 0 530 100" xmlns="http://www.w3.org/2000/svg">' +
        //     '<clipPath id="basemask"><rect x="0" y="0" height="100" width="530" /></clipPath>' +
        //     '<clipPath id="mask"><rect x="0" y="0" height="100" /></clipPath>' +
        // //                            '<path id="viewedpath" clip-path="url(#mask)">' +
        // '<g class="dot">' +
        //     '<circle class="klynt-tertiary-color-fill" r="15" />' +
        //     '<circle r="10" fill="#313131" />' +
        //     '<circle r="4" fill="#fff" />' +
        //     '</g>' +
        //     '</svg>' +
        // '<div class="gauge-label klynt-secondary-color-80 klynt-secondary-bg-color-10">{{#wording}}your_are_here{{/wording}}</div>' +
        '</div>' +
            '<div class="dashboard-figures">' +
            '<div class="dashboard-figure klynt-secondary-color-80"><i class="icon icon-eye klynt-tertiary-color"></i> <strong class="figure">{{#stats}}viewedPercent{{/stats}}%</strong> {{#wording}}program_percentage_viewed{{/wording}}</div>' +
            '<div class="dashboard-figure klynt-secondary-color-80"><i class="icon icon-thumbs klynt-tertiary-color"></i> <strong class="figure">{{#stats}}viewedSequences{{/stats}}/{{#stats}}totalSequences{{/stats}}</strong> {{#wording}}total_sequences{{/wording}}</div>' +
            '<div class="dashboard-figure klynt-secondary-color-80"><i class="icon icon-clock klynt-tertiary-color"></i> <strong class="figure">{{#stats}}viewedDuration{{/stats}}</strong> {{#wording}}total_duration{{/wording}}</div>' +
            '</div>' +
            '</div>';

        this._template_partials = {
            'tags-list': '<ol class="tags-list">' +
                '{{#tags}}<li class="tag-item klynt-secondary-bg-color-7  klynt-secondary-color-6" style="font-size: {{font_size}}px; width: {{width}}%"><a href="#">' +
                '<span class="progress-bar klynt-secondary-bg-color-10" style="width: {{bar_width}}%"></span>' +
                '<span class="label">{{label}}</span>' +
                '<span class="progress klynt-secondary-color-20"><i class="icon icon-check"></i>{{viewed_sequences}}/{{total_sequences}}</span>' +
                '</a></li>{{/tags}}' +
                '</ol>'
        };

        klynt.MenuItem.call(this, data);
    };

    klynt.Dashboard.prototype = {
        _gauge: null
    };

    klynt.Dashboard.prototype.init = function () {
        klynt.MenuItem.prototype.init.call(this);
        this._$element.addClass('menu-dashboard');
    };

    klynt.Dashboard.prototype.render = function () {
        function format_duration(duration) {
            var date = new Date(1970, 1, 1);
            date.setSeconds(duration);
            var time = date.toTimeString();
            if (duration > 3600 * 9) {
                return '9:59:59';
            }
            return duration > 3600 ? time.substr(1, 7) : time.substr(3, 5);
        }

        // TODO improve variables replacement
        klynt.data.wording.total_duration = klynt.wording.get('total_duration').replace('{0}', format_duration(klynt.sequences.duration));
        this._data.stats = function () {
            return function (key, render) {
                if (key == 'viewedDuration') {
                    return format_duration(klynt.stats[key]);
                }
                if (key == 'totalSequences') {
                    return klynt.sequences.list.length;
                }
                return klynt.stats[key];
            };
        };
        this._data.wording = function () {
            return function (key, render) {
                return klynt.wording.get(key);
            };
        };

        // Tags
        this._setupTags();

        // Render template
        klynt.MenuItem.prototype.render.call(this);

        this._setupGauge();

        $(".dashboard-tags-wrapper").css({
            height: $('.dashboard-tags').height(),
            width: $('.dashboard-tags').width()
        }).nanoScroller({
            iOSNativeScrolling: true,
            preventPageScrolling: true
        });
    };

    klynt.Dashboard.prototype._setupTags = function () {
        this._data.tags = [];

        if (klynt.data.advanced.useTags !== true) {
            this._data.showTags = false;
            return;
        }

        this._data.showTags = true;
        var tags = klynt.metadata.tags;

        var max_sequences = Math.max.apply(Math, tags.map(function (t) {
            return klynt.metadata.findSequencesByTag(t).length;
        })),
            max_width = 100,
            min_width = 50,
            max_font_size = 18,
            min_font_size = 13;

        this._data.tags = tags.map(createTemplateTagsData).sort(compareBySequencesCount);

        function createTemplateTagsData(tag) {
            var sequences = klynt.metadata.findSequencesByTag(tag);
            var viewedSequences = sequences.reduce(isViewed, 0);
            var data = {
                label: tag,
                viewed_sequences: viewedSequences,
                total_sequences: sequences.length,
                font_size: min_font_size + Math.round(((max_font_size - min_font_size) * sequences.length) / max_sequences),
                width: min_width + Math.round(((max_width - min_width) * sequences.length) / max_sequences),
                bar_width: Math.round((100 * viewedSequences) / sequences.length)
            };

            if (data.width < min_width) {
                data.width = min_width;
            }
            return data;

            function isViewed(count, sequence) {
                return count + (sequence.viewed) ? 1 : 0;
            }
        }

        function compareBySequencesCount(a, b) {
            return parseInt(b.total_sequences) - parseInt(a.total_sequences);
        }
    };

    klynt.Dashboard.prototype._setupGauge = function () {
        var $gauge = $('.dashboard-gauge');

        this._gauge = {
            curve: new CurveAnimator(
                [10, 50], [520, 50], [230, 115], [300, -45]
            ),
            $element: $gauge,
            $dot: $gauge.find('.dot'),
            $label: $gauge.find('.gauge-label').hide(),
            $basemask: $gauge.find('#basemask rect'),
            $mask: $gauge.find('#mask rect')
        };

        this._gauge.curve.animate(2, this._animateGauge.bind(this));

        this._gauge.$dot.add(this._gauge.$label).on('click', function (e) {
            e.preventDefault();
            klynt.menu.close();
        });

    };

    klynt.Dashboard.prototype._animateGauge = function (point, percent) {
        if (Modernizr.csstransforms) {
            this._gauge.$dot.attr("transform", "translate(" + point.x + "," + point.y + ")");
        } else {
            this._gauge.$dot.css("left", point.x + "px").css("top", point.y + "px");
        }
        this._gauge.$basemask.attr("x", point.x);
        this._gauge.$mask.attr("width", point.x);
        if (percent == 0.8) {
            this._gauge.$label
                .css("left", (point.x - 55) + "px")
                .css("top", (point.y - 50) + "px")
                .fadeIn(200);
        }
    };

    klynt.Dashboard.prototype = klynt.utils.mergePrototypes(klynt.MenuItem, klynt.Dashboard);

    // CurveAnimator
    // WORK IN PROGRESS !

    var CurveAnimator = function (from, to, c1, c2) {
        this.$svg = $('.dashboard-gauge svg');
        this.path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        if (!c1) {
            c1 = from;
        }
        if (!c2) {
            c2 = to;
        }
        this.path.setAttribute('id', 'basepath');
        this.path.setAttribute('clip-path', 'url(#basemask)');
        this.path.setAttribute('d', 'M' + from.join(',') + 'C' + c1.join(',') + ' ' + c2.join(',') + ' ' + to.join(','));
        this.viewedPath = $(this.path).clone().attr('id', 'viewedpath').attr('clip-path', 'url(#mask)').attr('class', 'klynt-tertiary-color-stroke');
        if (this.$svg.find('path').length == 0) {
            this.$svg.prepend(this.path, this.viewedPath);
        }
        this.len = this.path.getTotalLength();
        CurveAnimator.lastCreated = this;
    };

    CurveAnimator.prototype.animate = function (duration, callback, delay) {
        var curveAnim = this;
        if (!delay) {
            delay = 1 / 40;
        }
        clearInterval(curveAnim.animTimer);
        var startTime = new Date;
        curveAnim.animTimer = setInterval(function () {
            var elapsed = ((new Date) - startTime) / 1000;
            var percent = elapsed / duration;
            if (percent >= 0.8) {
                percent = 0.8;
                clearInterval(curveAnim.animTimer);
            }
            callback(curveAnim.pointAt(percent), percent);
        }, delay * 1000);
    };

    CurveAnimator.prototype.stop = function () {
        clearInterval(this.animTimer);
    };

    CurveAnimator.prototype.pointAt = function (percent) {
        return this.path.getPointAtLength(this.len * percent);
    };
})(window.klynt);