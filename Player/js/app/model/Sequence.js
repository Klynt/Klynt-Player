/**
 * Copyright 2014, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 * */

(function (klynt) {
    klynt.Sequence = function (rawData) {
        this._rawData = rawData;
        this._alias = klynt.sequences.getAliasBySequenceId(this.id);
        this._tags = (rawData.tags || '').split(',');
        this._links = [];

        this._buttons = this._wrapCollection(rawData.buttons, klynt.Button);
        this._texts = this._wrapCollection(rawData.texts, klynt.Text);
        this._iframes = this._wrapCollection(rawData.iframes, klynt.iFrame);
        this._shapes = this._wrapCollection(rawData.shapes, klynt.Shape);
        this._images = this._wrapCollection(rawData.images, klynt.Image);
        this._videos = this._wrapCollection(rawData.videos, klynt.Video);
        this._externalVideos = this._wrapCollection(rawData.externalVideos, klynt.ExternalVideo);
        this._audios = this._wrapCollection(rawData.audios, klynt.Audio);

        this._medias = this._videos.concat(this._externalVideos).concat(this._audios);
    };

    klynt.Sequence.prototype = {
        _rawData: null,

        get id() {
            return this._rawData.id;
        },

        get x() {
            return this._rawData.x;
        },

        get y() {
            return this._rawData.y;
        },

        get size() {

            return this._rawData.size;
        },

        get hideInMindmap() {
            return this._rawData.hideInMindmap;
        },

        get hideThumbnailInMindmap() {
            return this._rawData.hideThumbnailInMindmap;
        },

        get hideTitleInMindmap() {
            return this._rawData.hideTitleInMindmap;
        },

        get color() {
            return this._rawData.color;
        },

        _links: null,
        get links() {
            return this._links;
        },

        _alias: null,
        get alias() {
            return this._alias;
        },

        get duration() {
            return this._rawData.duration;
        },

        get classNames() {
            return this._rawData.classNames || [];
        },

        get backgroundColor() {
            return this._rawData.backgroundColor || 0;
        },

        get title() {
            return (this._rawData.title || '').replace('//', ' ');
        },

        get rawTitle() {
            return this._rawData.title || '';
        },

        get description() {
            return this._rawData.description || '';
        },

        _tags: null,
        get tags() {
            return this._tags;
        },

        get thumbnail() {
            return this._rawData.thumbnail || this._rawData.thumbnailUrl || null;
        },

        get geolocated() {
            return this._rawData.hasOwnProperty('longitude') && this._rawData.hasOwnProperty('latitude');
        },

        get longitude() {
            return this._rawData.longitude || 0;
        },

        get latitude() {
            return this._rawData.latitude || 0;
        },

        get index() {
            return this._rawData.hasOwnProperty('index') ? this._rawData.index : -1;
        },

        viewed: false,

        _buttons: null,
        get buttons() {
            return this._buttons;
        },

        _texts: null,
        get texts() {
            return this._texts;
        },

        _images: null,
        get images() {
            return this._images;
        },

        _iframes: null,
        get iframes() {
            return this._iframes;
        },

        _shapes: null,
        get shapes() {
            return this._shapes;
        },

        _videos: null,
        get videos() {
            return this._videos;
        },

        _externalVideos: null,
        get externalVideos() {
            return this._externalVideos;
        },

        _audios: null,
        get audios() {
            return this._audios;
        },

        _medias: null,
        get medias() {
            return this._medias;
        },

        _syncMaster: null,
        get syncMaster() {
            return this._syncMaster;
        },

        get formattedDuration() {
            var date = new Date(1970, 1, 1);
            date.setSeconds(this.duration);
            var time = date.toTimeString();
            return this.duration > 3600 ? time.substr(0, 8) : time.substr(3, 5);
        }
    };

    klynt.Sequence.prototype._wrapCollection = function (collection, wrapper) {
        return (collection || []).map(createWrapper.bind(this));

        function createWrapper(data) {
            var syncMaster = data.id === this._rawData.syncMaster;
            updateElementTiming(data, this.duration, syncMaster);
            var element = new wrapper(data);
            if (syncMaster) {
                element.syncMaster = true;
                this._syncMaster = element;
            }
            if (element.link) {
                this._links.push(element.link);
            }
            return element;
        }

        function updateElementTiming(data, sequenceDuration, syncMaster) {
            var elementEnd = klynt.utils.getTimeFromString(data.dataend);
            if (elementEnd >= sequenceDuration && !syncMaster) {
                data.dataend = klynt.utils.getStringFromTime(elementEnd + 1);
                data.duration = klynt.utils.getStringFromTime(klynt.utils.getTimeFromString(data.duration) + 1);
            }
        }
    };
})(window.klynt);