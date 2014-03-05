/**
 * Copyright 2014, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 * */

(function (klynt) {
    klynt.Mindmap = function (data) {
        this._data = data;

        var watermark = this._data.displayWatermark ? '<img src="' + klynt.data.watermark.image + '" class="mindmap-watermark">' : '';

        this._template = '<div class="mindmap-graph-renderer"></div><div class="mindmap-sequence-info klynt-primary-color-bg-90 klynt-secondary-color"></div>' + watermark;

        klynt.MenuItem.call(this, this._data);
    };

    klynt.Mindmap.prototype = {
        _nodesOpacity: 1, // Opacité des noeuds des séquences non visitées
        _linesOpacity: 1, // Opacité des liens non traversés
        _linesThickness: 1, // Épaisseur des liens et des flèches
        _borderWidth: 2, // Épaisseur de la bordure des noeuds
        _arrowSize: 10, // Ratio de la taille des flèches
        _labelSizeRatio: 0.6, // Ratio de la taille des labels
        _font: 'Open Sans', // Font des labels
        _labelThreshold: 10, // Taille minimum du noeud pour que le label soit affiché
        _imageThreshold: 10, // Taille minimum d'une image pour être affichée
        _shadowX: 3, // Direction de l'ombre sur les abcisses
        _shadowY: 3, // Direction de l'ombre sur les ordonnées
        _shadowBlur: 6, // Niveau de dispersion de l'ombre
        _shadowColor: 'rgba(0,0,0,0.2)' // Couleur de l'ombre
    };

    klynt.Mindmap.prototype.init = function () {
        klynt.MenuItem.prototype.init.call(this);
        this._$element.addClass('menu-mindmap');
    };

    klynt.Mindmap.prototype.render = function () {

        klynt.MenuItem.prototype.render.call(this);

        var g = {
            nodes: [],
            edges: []
        };

        var maxSequenceSize = 0;

        var storage, opacity;
        var arrow = this._data.displayLinksArrow;
        var sizes = {
            small: this._data.smallSequenceSize,
            medium: this._data.mediumSequenceSize,
            large: this._data.largeSequenceSize,
        }

        klynt.sequences.list.forEach(function (sequence) {
            if (!sequence.hideInMindmap) {

                switch (sequence.size) {
                case 'small':
                    // sequenceSize = 1;
                    sequenceSize = sizes.small;
                    break;
                case 'medium':
                    // sequenceSize = 5;
                    sequenceSize = sizes.medium;
                    break;
                default: // large
                    // sequenceSize = 20;
                    sequenceSize = sizes.large;
                    break;
                }

                maxSequenceSize = Math.max(maxSequenceSize, sequenceSize);

                g.nodes.push({
                    id: sequence.id,
                    label: !sequence.hideTitleInMindmap ? sequence.rawTitle : null,
                    x: sequence.x,
                    y: sequence.y,
                    size: sequenceSize,
                    color: sequence.color,
                    type: 'klynt',
                    url: !sequence.hideThumbnailInMindmap ? sequence.thumbnail : null,
                    current: sequence == klynt.sequenceContainer.currentSequence,
                    viewed: sequence.viewed
                });

                sequence.links.forEach(function (link) {
                    if (link.type === 'linkToSequence' && !link.hideInMindmap && !link.target.hideInMindmap) {

                        storage = localStorage.getItem(sequence.id);
                        storage = JSON.parse(storage);

                        if (storage) {
                            if (storage.indexOf(link.target.id) > -1) {
                                opacity = 1;
                            } else {
                                opacity = this._linesOpacity;
                            }
                        }

                        g.edges.push({
                            id: 'e' + link.id,
                            source: sequence.id,
                            target: link.target.id,
                            size: 1,
                            type: 'klynt',
                            color: link.color,
                            opacity: opacity,
                            arrow: arrow && !link._data.hideArrowInMindmap,
                            controlDX: link.controlDX,
                            controlDY: link.controlDY
                        });
                    }
                });
            }
        });

        s = new sigma({
            graph: g,
            renderer: {
                container: this._$element.find('.mindmap-graph-renderer')[0],
                type: 'canvas'
            },
            settings: {
                edgeColor: 'default',
                maxNodeSize: maxSequenceSize,
                zoomMax: 2,
                edgesPowRatio: 0.5,
                nodesPowRatio: 1,
                labelSize: 'proportional',
                labelColor: 'node',
                labelHoverColor: 'node',
                sideMargin: 20,
                labelHoverShadowColor: 'node',

                nodesOpacity: this._nodesOpacity,
                linesOpacity: this._linesOpacity,
                linesThickness: this._linesThickness,
                borderWidth: this._borderWidth,
                arrowSize: this._arrowSize,
                labelSizeRatio: this._labelSizeRatio,
                font: this._font,
                hoverFont: this._font,
                labelThreshold: this._labelThreshold,
                imageThreshold: this._imageThreshold,
                shadowX: this._shadowX,
                shadowY: this._shadowY,
                shadowBlur: this._shadowBlur,
                shadowColor: this._shadowColor
            }
        });

        klynt.utils.callLater(function () {
            s.refresh();
        }, 400)

        var c = s.cameras[0];

        // Center graph on node on click
        s.bind('clickNode', function (e) {

            var node = e.data.node;
            var sequence = klynt.sequences.find(node.id);

            if (oldposition.x == currentPosition.x && oldposition.y == currentPosition.y) {
                klynt.player.open(sequence);
            } else {
                oldposition.x = c.x;
                oldposition.y = c.y;
                currentPosition.x = c.x;
                currentPosition.y = c.y;
            }
        });

        if (this._data.displayDescriptions) {
            s.bind('overNode', function (e) {
                var node = e.data.node;
                var sequence = klynt.sequences.find(node.id);

                $('.mindmap-sequence-info').html(sequence.title + '<br/><span class="klynt-tertiary-color">' + sequence.formattedDuration + '</span><hr/><p>' + sequence.description + '</p>').stop().show().animate({
                    opacity: 1
                }, 1000);

                $('.mindmap-graph-renderer').addClass('mouse-over-node');
            });

            s.bind('outNode', function (e) {
                $('.mindmap-sequence-info').stop().animate({
                    opacity: 0
                }, 1000, function () {
                    $(this).html('').hide();
                });

                $('.mindmap-graph-renderer').removeClass('mouse-over-node');
            });
        } else {
            s.bind('overNode', function (e) {
                $('.mindmap-graph-renderer').addClass('mouse-over-node');
            });

            s.bind('outNode', function (e) {
                $('.mindmap-graph-renderer').removeClass('mouse-over-node');
            });

        }

        var oldposition = {}, currentPosition = {};
        oldposition.x = c.x;
        oldposition.y = c.y;
        currentPosition.x = c.x;
        currentPosition.y = c.y;

        $(".mindmap-graph-renderer").mousedown(function () {
            oldposition.x = c.x;
            oldposition.y = c.y;
        });
        c.bind('coordinatesUpdated', function (e) {
            currentPosition.x = c.x;
            currentPosition.y = c.y;
        });
        s.bind('clickStage', function (e) {
            //console.log(e.type);
        });
    }

    klynt.Mindmap.prototype = klynt.utils.mergePrototypes(klynt.MenuItem, klynt.Mindmap);
})(window.klynt);