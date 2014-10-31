/**
 * Copyright 2014, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 * */

(function (klynt) {
    klynt.Mindmap = function (data) {
        this._data = data;

        var watermark = this._data.displayWatermark ? '<img src="' + klynt.data.watermark.image + '" class="mindmap-watermark">' : '';
        var arrowBottom =
            '<svg version="1.1" baseProfile="basic" class="mindmap-arrow mindmap-arrow-bottom"' +
            'xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:a="http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/"' +
            'x="0px" y="0px" width="9px" height="6px" viewBox="0 -0.2 9 6" overflow="visible" enable-background="new 0 -0.2 9 6"' +
            'xml:space="preserve">' +
            '<defs>' +
            '</defs>' +
            '<polygon class="klynt-tertiary-color-fill" points="4.5,5.8 0,0 9,0 "/>' +
            '</svg>';

        var arrowLeft =
            '<svg version="1.1" id="Calque_1"  class="mindmap-arrow mindmap-arrow-right" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"' +
            'width="5.8px" height="9px" viewBox="1.6 -1.6 5.8 9" enable-background="new 1.6 -1.6 5.8 9" xml:space="preserve">' +
            '<polygon class="klynt-tertiary-color-fill" points="7.4,2.9 1.6,7.4 1.6,-1.6 "/>' +
            '</svg>';

        var arrowRight =
            '<svg version="1.1" id="Calque_1"  class="mindmap-arrow mindmap-arrow-left" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"' +
            'width="5.8px" height="9px" viewBox="1.6 -1.6 5.8 9" enable-background="new 1.6 -1.6 5.8 9" xml:space="preserve">' +
            '<polygon class="klynt-tertiary-color-fill" points="1.6,2.9 7.4,-1.6 7.4,7.4 "/>' +
            '</svg>';

        this._template = '<div class="mindmap-graph-renderer"></div><div class="mindmap-sequence-info klynt-primary-color-bg klynt-secondary-color"></div>' + watermark + arrowBottom + arrowRight + arrowLeft;

        klynt.MenuItem.call(this, this._data);
    };

    klynt.Mindmap.prototype = {
        _nodesOpacity: 3, // Opacité des noeuds des séquences non visitées
        _linesOpacity: 1, // Opacité des liens non traversés
        _linesThickness: 1, // Épaisseur des liens et des flèches
        _borderWidth: 1, // Épaisseur de la bordure des noeuds
        _arrowSize: 10, // Ratio de la taille des flèches
        _proportionalLabel: true, // Taille du label proportionnel la taille du noeud
        _labelSizeRatio: 40, // Ratio de la taille des labels
        _font: klynt.data.general.mainFontName, // Font des labels
        _labelThreshold: 15, // Taille minimum du noeud pour que le label soit affiché
        _imageThreshold: 2, // Taille minimum d'une image pour être affichée
        _shadowX: 0, // Direction de l'ombre sur les abcisses
        _shadowY: 0, // Direction de l'ombre sur les ordonnées
        _shadowBlur: 20, // Niveau de dispersion de l'ombre
        _shadowColor: 'rgba(0,0,0,0.4)', // Couleur de l'ombre
        _organicEffect: false // Effet organique,

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
                    dx: 0,
                    dy: 0,
                    size: sequenceSize,
                    color: sequence.color,
                    type: 'klynt',
                    url: !sequence.hideThumbnailInMindmap ? sequence.thumbnail : null,
                    current: sequence == klynt.sequenceContainer.currentSequence,
                    viewed: sequence.viewed
                });

                sequence.links.forEach(function (link) {
                    if (link.type === 'linkToSequence' && link.target && !link.hideInMindmap && !link.target.hideInMindmap) {

                        // storage = localStorage.getItem(sequence.id);
                        // storage = JSON.parse(storage);

                        // if (storage) {
                        //     if (storage.indexOf(link.target.id) > -1) {
                        //         opacity = 1;
                        //     } else {
                        //         opacity = this._linesOpacity;
                        //     }
                        // }

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
                //  labelSize: 'proportional',
                labelSize: 'fixed',
                labelColor: 'node',
                labelHoverColor: 'node',
                sideMargin: 20,
                labelHoverShadowColor: 'node',

                // animationsTime: 2000,

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
                shadowColor: this._shadowColor,
                organicEffect: this._organicEffect,
                proportionalLabel: this._proportionalLabel,
                primaryColor: 'rgba(51, 51, 51, 1)',
                secondaryColor: 'rgba(255, 255, 255, 1)',
                tertiaryColor: 'rgba(255, 102, 51, 1)'
            }
        });

        // klynt.utils.callLater(function () {
        //     s.refresh();
        // }, 400)

        setInterval(function () {
            s.refresh();
        }, 50);

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

        var canvasHeight = $('.sigma-scene').outerHeight();
        var sequenceInfo = $('.mindmap-sequence-info');
        var sequenceInfoWidth;
        var sequenceInfoHeight;
        var margin = 20;
        var currentArrow;
        var infoShow;

        if (this._data.displayDescriptions) {
            s.bind('overNode', function (e) {

                var id = s.renderers[0].conradId;
                var node = e.data.node;
                var sequence = klynt.sequences.find(node.id);
                var nodeX = node['renderer' + id + ':x'];
                var nodeY = node['renderer' + id + ':y'];
                var nodeSize = node['renderer' + id + ':size'];
                var infoX, infoY;

                if (sequence.description == '') {
                    sequenceInfo.html(sequence.title + '<br/><span class="klynt-tertiary-color">' + sequence.formattedDuration + '</span>');
                } else {
                    sequenceInfo.html(sequence.title + '<br/><span class="klynt-tertiary-color">' + sequence.formattedDuration + '</span><hr/><p class="ellipsis">' + sequence.description + '</p>');
                }

                sequenceInfoWidth = sequenceInfo.outerWidth();
                sequenceInfoHeight = sequenceInfo.outerHeight();

                if (nodeY + nodeSize + margin + sequenceInfoHeight > canvasHeight) {
                    infoX = nodeX - (sequenceInfoWidth / 2);
                    infoY = nodeY - nodeSize - margin - sequenceInfoHeight;
                    currentArrow = $('.mindmap-arrow-bottom');
                    currentArrow.css({
                        left: nodeX - 4,
                        top: nodeY - nodeSize - margin
                    });

                } else if (nodeX + nodeSize + margin + sequenceInfoWidth > klynt.player.width) {
                    infoX = nodeX - nodeSize - margin - sequenceInfoWidth;
                    infoY = nodeY - sequenceInfoHeight / 2;
                    currentArrow = $('.mindmap-arrow-right');
                    currentArrow.css({
                        left: infoX + sequenceInfoWidth,
                        top: infoY + sequenceInfoHeight / 2
                    });
                } else {
                    infoX = nodeX + nodeSize + margin;
                    infoY = nodeY - sequenceInfoHeight / 2;
                    currentArrow = $('.mindmap-arrow-left');
                    currentArrow.css({
                        left: infoX - 7,
                        top: infoY + sequenceInfoHeight / 2
                    });
                }

                sequenceInfo.css({
                    left: infoX,
                    top: infoY
                });

                if (infoShow) {
                    clearTimeout(infoShow);
                }

                infoShow = setTimeout(function () {
                    var paramsAnimation = {
                        duration: 0.4,
                        properties: {
                            opacity: 1
                        }
                    }

                    klynt.animation.killTweens([currentArrow, sequenceInfo]);
                    currentArrow.add(sequenceInfo).show();
                    klynt.animation.to(paramsAnimation, [currentArrow, sequenceInfo]);

                    $('.ellipsis').ellipsis();
                }, 250);
                $('.mindmap-graph-renderer').addClass('mouse-over-node');
            });

            s.bind('outNode', function (e) {
                clearTimeout(infoShow);

                klynt.animation.killTweens([currentArrow, sequenceInfo]);

                currentArrow.add(sequenceInfo).css({
                    opacity: 0
                }).hide();

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

        var oldposition = {},
            currentPosition = {};
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
            $('.mindmap-arrow').hide();
            sequenceInfo.hide();
        });
        s.bind('clickStage', function (e) {});
    }

    klynt.Mindmap.prototype = klynt.utils.mergePrototypes(klynt.MenuItem, klynt.Mindmap);
})(window.klynt);