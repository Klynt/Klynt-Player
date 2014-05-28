/**
 * Copyright 2014, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 * */

(function (klynt) {
    klynt.Index = function (data) {
        var sequences = klynt.sequences.findAll(data.params.sequences);

        data.sequences = [];
        sequences.forEach(function (sequence) {
            sequence.current = sequence == klynt.sequenceContainer.currentSequence;
            sequence.showDescriptions = data.params.displayDescriptions;
            sequence.showDuration = data.params.displayDuration;
            // sequence.showMetadata = data.params.displayDescriptions || data.params.displayDuration;
            data.sequences.push(sequence);
        });

        this._mode = data.params.layout;

        this._template_list = {
            'list': '<div class="index-wrapper">' +
                '<div class="index-wrapper-scroll nano-container">' +
                '<div class="nano-content index-scroll-padding">' +
                '{{#sequences}}{{> list-sequence}}{{/sequences}}' +
                '</div>' +
                '</div>' +
                '</div>',
            'grid': '<div class="index-wrapper">' +
                '<div class="index-wrapper-scroll nano-container">' +
                '<div class="nano-content">' +
                '{{#sequences}}{{> gallery-sequence}}{{/sequences}}' +
                '</div>' +
                '</div>' +
                '</div>'
        };

        this._template = this._template_list[this._mode];

        //V1 Title | description | Time

        this._template_partials = {
            'list-sequence': '<div class="index-sequence index-list-sequence klynt-secondary-color {{#current}} current klynt-tertiary-color-border-bis{{/current}} {{^current}} {{#viewed}} viewed{{/viewed}} {{/current}}">' +
                '<a href="#{{alias}}" class="sequence-thumbnail sequence-link klynt-tertiary-color"><img src="{{^thumbnail}}Player/css/player/img/thumbnail.jpg{{/thumbnail}}{{#thumbnail}}{{thumbnail}}{{/thumbnail}}" alt="" /></a>' +
                '<a href="#{{alias}}" class="sequence-title sequence-link klynt-secondary-color">{{title}}</a>' +
                '{{#showDescriptions}}{{#description}}<div class="sequence-description">{{description}}</div>{{/description}}{{/showDescriptions}}' +
                '{{#showDuration}}<div class="sequence-metadata klynt-tertiary-color">' +
                '<i class="icon icon-clock"></i>{{formattedDuration}}' +
                '</div>{{/showDuration}}' +
                '</div>',
            'gallery-sequence': '<div class="index-sequence index-grid-sequence box-sequence {{#current}} current klynt-tertiary-color-border {{/current}} {{^current}} {{#viewed}} viewed{{/viewed}} {{/current}}{{#showDescriptions}}{{#description}} with-description{{/description}}{{/showDescriptions}}">' +
                '<a href="#{{alias}}" class="sequence-thumbnail sequence-link {{#current}}klynt-tertiary-color{{/current}} {{#viewed}}klynt-tertiary-color{{/viewed}}" style="background-image: url({{^thumbnail}}Player/css/player/img/thumbnail.jpg{{/thumbnail}}{{#thumbnail}}{{thumbnail}}{{/thumbnail}});"></a>' +
                '<a href="#{{alias}}" class="sequence-info sequence-link klynt-primary-color-bg-70{{#current}} current{{/current}}">' +
                '<div class="sequence-title klynt-secondary-color">{{title}}<i class="icon icon-info">i</i><i class="icon icon-eye"></i></div>' +
                '{{#showDuration}}<div class="sequence-duration klynt-tertiary-color">{{formattedDuration}}</div>{{/showDuration}}' +
                '{{#showDescriptions}}{{#description}}<div class="sequence-description klynt-secondary-color-border klynt-secondary-color">{{description}}</div>{{/description}}{{/showDescriptions}}' +
                '</a>' +
                '</div>'
        };

        //V2 Title | Time | description 

        // this._template_partials = {
        //     'list-sequence': '<div class="index-sequence index-list-sequence klynt-secondary-color {{#current}} current klynt-tertiary-color-border-bis{{/current}} {{^current}} {{#viewed}} viewed{{/viewed}} {{/current}}">' +
        //         '<a href="#{{alias}}" class="sequence-thumbnail sequence-link klynt-tertiary-color"><img src="{{^thumbnail}}Player/css/player/img/thumbnail.jpg{{/thumbnail}}{{#thumbnail}}{{thumbnail}}{{/thumbnail}}" alt="" /></a>' +
        //         '<a href="#{{alias}}" class="sequence-title sequence-link klynt-secondary-color">{{title}}</a>' +
        //         '{{#showDuration}}<div class="sequence-metadata klynt-tertiary-color">' +
        //         '<i class="icon icon-clock"></i>{{formattedDuration}}' +
        //         '</div>{{/showDuration}}' +
        //         '{{#showDescriptions}}{{#description}}<div class="sequence-description">{{description}}</div>{{/description}}{{/showDescriptions}}' +
        //         '</div>',
        //     'gallery-sequence': '<div class="index-sequence index-grid-sequence box-sequence {{#current}} current klynt-tertiary-color-border {{/current}} {{^current}} {{#viewed}} viewed{{/viewed}} {{/current}}{{#showDescriptions}}{{#description}} with-description{{/description}}{{/showDescriptions}}">' +
        //         '<a href="#{{alias}}" class="sequence-thumbnail sequence-link {{#current}}klynt-tertiary-color{{/current}} {{#viewed}}klynt-tertiary-color{{/viewed}}" style="background-image: url({{^thumbnail}}Player/css/player/img/thumbnail.jpg{{/thumbnail}}{{#thumbnail}}{{thumbnail}}{{/thumbnail}});"></a>' +
        //         '<a href="#{{alias}}" class="sequence-info sequence-link klynt-primary-color-bg-70{{#current}} current{{/current}}">' +
        //         '<div class="sequence-title klynt-secondary-color">{{title}}<i class="icon icon-info">i</i><i class="icon icon-eye"></i></div>' +
        //         '{{#showDuration}}<div class="sequence-duration klynt-tertiary-color">{{formattedDuration}}</div>{{/showDuration}}' +
        //         '{{#showDescriptions}}{{#description}}<div class="sequence-description klynt-secondary-color-border klynt-secondary-color ellipsis">{{description}}</div>{{/description}}{{/showDescriptions}}' +
        //         '</a>' +
        //         '</div>'
        // };

        //V3 Title + Time | description

        // this._template_partials = {
        //     'list-sequence': '<div class="index-sequence index-list-sequence klynt-secondary-color {{#current}} current klynt-tertiary-color-border-bis{{/current}} {{^current}} {{#viewed}} viewed{{/viewed}} {{/current}}">' +
        //         '<a href="#{{alias}}" class="sequence-thumbnail sequence-link klynt-tertiary-color"><img src="{{^thumbnail}}Player/css/player/img/thumbnail.jpg{{/thumbnail}}{{#thumbnail}}{{thumbnail}}{{/thumbnail}}" alt="" /></a>' +
        //         '<a href="#{{alias}}" class="sequence-title sequence-link klynt-secondary-color">{{title}}' +
        //         '<span class="klynt-tertiary-color"><i class="icon icon-clock"></i>{{formattedDuration}}</span></a>' +
        //         '{{#showDescriptions}}{{#description}}<div class="sequence-description">{{description}}</div>{{/description}}{{/showDescriptions}}' +
        //         '</div>',
        //     'gallery-sequence': '<div class="index-sequence index-grid-sequence box-sequence {{#current}} current klynt-tertiary-color-border {{/current}} {{^current}} {{#viewed}} viewed{{/viewed}} {{/current}}{{#showDescriptions}}{{#description}} with-description{{/description}}{{/showDescriptions}}">' +
        //         '<a href="#{{alias}}" class="sequence-thumbnail sequence-link {{#current}}klynt-tertiary-color{{/current}} {{#viewed}}klynt-tertiary-color{{/viewed}}" style="background-image: url({{^thumbnail}}Player/css/player/img/thumbnail.jpg{{/thumbnail}}{{#thumbnail}}{{thumbnail}}{{/thumbnail}});"></a>' +
        //         '<a href="#{{alias}}" class="sequence-info sequence-link klynt-primary-color-bg-70{{#current}} current{{/current}}">' +
        //         '<div class="sequence-title klynt-secondary-color">{{title}}<i class="icon icon-info">i</i><i class="icon icon-eye"></i></div>' +
        //         '{{#showDuration}}<div class="sequence-duration klynt-tertiary-color">{{formattedDuration}}</div>{{/showDuration}}' +
        //         '{{#showDescriptions}}{{#description}}<div class="sequence-description klynt-secondary-color-border klynt-secondary-color">{{description}}</div>{{/description}}{{/showDescriptions}}' +
        //         '</a>' +
        //         '</div>'
        // };

        klynt.MenuItem.call(this, data);
    };

    klynt.Index.prototype = {
        _mode: null,
        _template_list: null
    };

    klynt.Index.prototype.init = function () {
        klynt.MenuItem.prototype.init.call(this);
        this._$element.addClass('menu-index menu-index-' + this._mode);

        this._data.showDescriptions = klynt.data.advanced.useSequenceDescriptions;
    };

    klynt.Index.prototype.render = function () {
        klynt.MenuItem.prototype.render.call(this);

        var $indexGallerySequences = this._$element.find('.index-grid-sequence');
        var $sequenceLinks = this._$element.find('.sequence-link');

        $sequenceLinks.on('click', function (e) {
            e.preventDefault();

            var alias = $(this).attr('href').split('#')[1];
            var id = klynt.sequences.getSequenceIdByAlias(alias);
            klynt.player.openFromMenu(id);

        });

        if (Modernizr.touch) {
            $indexGallerySequences
                .on('click', function (e) {
                    e.preventDefault();
                })
                .hammer().on('tap', '.sequence-thumbnail', function (e) {
                    window.location = $(this).attr('href');
                });

            if (this._data.showDescriptions) {
                $indexGallerySequences.hammer().on('tap', '.sequence-info', function (e) {
                    if ($(e.gesture.target).is('.icon-eye') || !$(this).closest('.index-grid-sequence').hasClass('with-description')) {
                        window.location = $(this).attr('href');
                        return;
                    }

                    $(this)
                        .toggleClass('klynt-primary-color-bg klynt-primary-color-bg-70')
                        .find('.icon').toggle()
                        .closest('.index-grid-sequence').toggleClass('active');

                    $(this).find('.sequence-duration')
                        .toggleClass('klynt-tertiary-color klynt-secondary-color');

                });
            } else {
                $indexGallerySequences.hammer().on('tap', '.sequence-info', function (e) {
                    window.location = $(this).attr('href');
                }).find('.icon-info').hide();
            }

        } else {
            $indexGallerySequences.on('mouseenter mouseleave', function () {
                $(this).find('.sequence-info').toggleClass(
                    'klynt-primary-color-bg klynt-primary-color-bg-70');

            });
        }

    };

    klynt.Index.prototype.update = function () {

    };

    klynt.Index.prototype = klynt.utils.mergePrototypes(klynt.MenuItem, klynt.Index);
})(window.klynt);