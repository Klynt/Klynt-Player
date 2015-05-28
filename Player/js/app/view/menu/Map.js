/**
 * Copyright 2014, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 * */

(function (klynt) {
    klynt.Map = function (data) {

        this._sequences = data.params.sequences;

        this._template =
            '<div class="map-controls klynt-primary-map-controls-bg-color klynt-secondary-map-controls-color">' +
            '   <a href="#" class="map-controls-zoomin icon-zoom"></a>' +
            '   <a href="#" class="map-controls-zoomout icon-dezoom"></a>' +
            '  </div>' +
            '<div id="map-canvas" class="map-canvas"></div>';

        this._template_partials = {};
        this._template_partials.infobox =
            '<div class="pointer map-sequence box-sequence{{^viewed}} klynt-tertiary-color-border{{/viewed}}{{#current}} current{{/current}}{{^current}}{{#viewed}} viewed{{/viewed}}{{/current}}{{#showDescriptions}}{{#description}} with-description{{/description}}{{/showDescriptions}}" onclick="klynt.player.openFromMenu(\'{{id}}\')">' +
            '   <a class="sequence-thumbnail sequence-link klynt-tertiary-color" style="background-image: url({{^thumbnail}}Player/css/player/img/thumbnail.jpg{{/thumbnail}}{{#thumbnail}}{{thumbnail}}{{/thumbnail}});"></a>' +
            '   <a class="sequence-info sequence-link klynt-primary-color-bg-70">' +
            '       <div class="sequence-title klynt-secondary-color">{{title}}<i class="icon icon-info">i</i><i class="icon icon-eye"></i></div>' +
            '       <div class="sequence-duration klynt-tertiary-color">{{#showDuration}}{{formattedDuration}}{{/showDuration}}{{^showDuration}}&nbsp;{{/showDuration}}</div>' +
            '       {{#showDescriptions}}{{#description}}<div class="sequence-description klynt-secondary-color ellipsis">{{description}}</div>{{/description}}{{/showDescriptions}}' +
            '   </a>' +
            '</div>';

        klynt.MenuItem.call(this, data);
    };

    klynt.Map.prototype = {
        _map: null,
        _markers: [],
        _currentMarker: null,
        _infoBox: null
    };

    klynt.Map.prototype.init = function () {
        klynt.MenuItem.prototype.init.call(this);

        this._$element.addClass('menu-map');

        if (typeof google == 'undefined') {
            this._loadGoogleMaps();
        }
    };

    klynt.Map.prototype.render = function () {
        klynt.MenuItem.prototype.render.call(this);

        if (typeof google !== 'undefined') {
            google.maps.visualRefresh = true;

            var script = document.createElement("script");
            script.type = "text/javascript";
            script.src = "Player/js/libs/map.infobox.js";
            document.body.appendChild(script);

            if (typeof this._data.params.center.lat === 'undefined')
                this._data.params.center = new google.maps.LatLng(this._data.params.center[0], this._data.params.center[1]);

            setTimeout(function () {

                this._map = new google.maps.Map(this._$element.find('#map-canvas')[0], this._data.params);

                this._addMarkers();
                this._addControls();

                google.maps.event.addDomListener(window, "resize", function () {
                    this.onResize(this._map);
                }.bind(this));

            }.bind(this), 0);
        }
    };

    klynt.Map.prototype.update = function () {

    };

    klynt.Map.prototype.onResize = function (map) {
        setTimeout(function () {
            google.maps.event.trigger(this._map, 'resize');
        }.bind(this), 100);
    };

    klynt.Map.prototype._loadGoogleMaps = function () {
        var script = document.createElement("script");
        script.type = "text/javascript";

        var apiKey = klynt.data.general.mapsKey;
        script.src = "http://maps.googleapis.com/maps/api/js?key=" + apiKey + "&sensor=false&callback=klynt.menu.renderMaps";

        document.body.appendChild(script);
    };

    klynt.Map.prototype._addMarkers = function () {
        var icons = {
            standard: {
                url: 'Player/css/player/img/map-marker.svg',
                anchor: new google.maps.Point(10, 32),
                size: new google.maps.Size(21, 32)
            },
            viewed: {
                url: 'Player/css/player/img/map-marker-viewed.svg',
                anchor: new google.maps.Point(10, 32),
                size: new google.maps.Size(21, 32)
            }
        };

        var markedSequences = klynt.sequences.findAll(this._sequences);

        function addMarker(i, sequence) {
            var coords = new google.maps.LatLng(sequence.latitude, sequence.longitude);
            var marker = new google.maps.Marker({
                position: coords,
                map: this._map,
                icon: sequence.viewed ? icons.viewed : icons.standard,
                title: sequence.title
            });

            google.maps.event.addListener(marker, 'click', this._onClickMarkerHandler(marker, sequence).bind(
                this));
            this._markers.push(marker);
        }

        $.each(markedSequences, addMarker.bind(this));

        google.maps.event.addListener(this._map, 'click', this._onClickMapHandler().bind(this));
        google.maps.event.addListener(this._map, 'zoom_changed', this._onZoomHandler().bind(this));
    };

    klynt.Map.prototype._onClickMarkerHandler = function (marker, sequence) {
        return function () {
            if (this._infoBox) this._infoBox.close();

            sequence.current = klynt.sequenceContainer.currentSequence == sequence;
            sequence.showDescriptions = this._data.params.displayDescriptions;
            sequence.showDuration = this._data.params.displayDuration;
            //sequence.showMetadata = this._data.params.displayDescriptions || this._data.params.displayDuration;

            var content = Mustache.render(this._template_partials.infobox, sequence);
            this._infoBox = new InfoBox({
                content: content,
                alignBottom: true,
                boxClass: 'infobox',
                closeBoxURL: '',
                infoBoxClearance: new google.maps.Size(20, 20),
                pixelOffset: new google.maps.Size(-105, -15)
            });
            this._infoBox.open(marker.get('map'), marker);
        };
    };

    klynt.Map.prototype._onClickMapHandler = function () {
        return function () {
            if (this._infoBox) this._infoBox.close();
        };
    };

    klynt.Map.prototype._addControls = function () {
        $('.map-controls').hammer()
            .on('click', '.map-controls-zoomin', this._onClickControlHandler(1).bind(
                this))
            .on('click', '.map-controls-zoomout', this._onClickControlHandler(-1).bind(
                this));

        if (this._data.params.zoom == this._data.params.maxZoom) $('.map-controls-zoomin').addClass('inactive');
        if (this._data.params.zoom == this._data.params.minZoom) $('.map-controls-zoomout').addClass('inactive');
    };

    klynt.Map.prototype._onClickControlHandler = function (param) {
        return function (e) {
            e.preventDefault();
            var zoom = this._map.getZoom() + param;
            this._map.setZoom(zoom);
        };
    };

    klynt.Map.prototype._onZoomHandler = function () {
        return function () {
            $('.map-controls-zoomin').toggleClass('inactive', (this._map.getZoom() >= this._data.params.maxZoom));
            $('.map-controls-zoomout').toggleClass('inactive', (this._map.getZoom() <= this._data.params.minZoom));
        };
    };

    klynt.Map.prototype = klynt.utils.mergePrototypes(klynt.MenuItem, klynt.Map);
})(window.klynt);