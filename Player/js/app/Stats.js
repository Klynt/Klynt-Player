/**
 * Copyright 2014, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 *
 * This file contains the implementation of the stats module.
 * */

(function (klynt) {
    var TIMER_INTERVAL = 500;
    var VIEWING_TIME_COOKIE = 'viewingTime';
    var LAST_PLAYED_SEQUENCE_ID_COOKIE = 'lastPlayedSequenceId';
    var VIEWED_SEQUENCE_IDS_COOKIE = 'viewedSequenceIds';
    var COOKIE_SETTINGS = {
        expires: 365,
        path: ''
    };
    var MAX_VIEWED_DURATION = 3600 * 10 - 1;

    var lastTimerTick = new Date().getTime();

    var accessors = {
        get lastPlayedSequence() {
            var sequenceId = $.cookie(LAST_PLAYED_SEQUENCE_ID_COOKIE);
            return klynt.sequences.find(sequenceId);
        },
        set lastPlayedSequence(sequence) {
            if (!sequence || !sequence.id) {
                return;
            }
            $.cookie(LAST_PLAYED_SEQUENCE_ID_COOKIE, sequence.id, COOKIE_SETTINGS);
            this.saveAsViewed(sequence);
        },

        get viewedSequenceIds() {
            var gne = $.cookie(VIEWED_SEQUENCE_IDS_COOKIE);
            try {
                return JSON.parse(gne);
            } catch (error) {
                return [];
            }
        },
        set viewedSequenceIds(ids) {
            try {
                $.cookie(VIEWED_SEQUENCE_IDS_COOKIE, JSON.stringify(ids), COOKIE_SETTINGS);
            } catch (error) {}
        },

        get viewedSequences() {
            return this.viewedSequenceIds.length;
        },

        get viewedPercent() {
            var viewedPercent = Math.round(this.viewedDuration / klynt.sequences.duration * 100);
            return Math.min(viewedPercent, 100);
        },

        get viewedDuration() {
            return Math.min(this.viewingDuration, MAX_VIEWED_DURATION);
        },

        get viewingDuration() {
            try {
                return parseFloat($.cookie(VIEWING_TIME_COOKIE)) || 0;
            } catch (error) {
                return 0;
            }
        },

        set viewingDuration(value) {
            try {
                $.cookie(VIEWING_TIME_COOKIE, value.toString(), COOKIE_SETTINGS);
            } catch (error) {}
        }
    };

    klynt.getModule('stats', accessors).expose(init, saveAsViewed);

    function init() {
        setInterval(updateViewingTime, TIMER_INTERVAL);
        flagViewedSequencesFromCookies();
        klynt.player.$element.on('open.sequence open.overlay', handleSequenceEvent);
    }

    function handleSequenceEvent(event, sequence) {
        if (event.type === 'open') {
            klynt.stats.lastPlayedSequence = sequence;
        }
    }

    function saveAsViewed(sequence) {
        if (sequence && sequence.id) {
            sequence.viewed = true;
            updateField('viewedSequenceIds', addId);
        }

        function addId(ids) {
            if (ids.indexOf(sequence.id) === -1) {
                ids.push(sequence.id);
            }
            return ids;
        }
    }

    function flagViewedSequencesFromCookies() {
        klynt.stats.viewedSequenceIds.map(klynt.sequences.find).forEach(flagAsViewed);
    }

    function flagAsViewed(sequence) {
        if (sequence) {
            sequence.viewed = true;
        }
    }

    function updateViewingTime() {
        updateField('viewingDuration', updateTime);

        function updateTime(time) {
            var currentTime = new Date().getTime();
            if (!isNaN(lastTimerTick)) {
                time += (currentTime - lastTimerTick) / 1000;
            }
            lastTimerTick = currentTime;

            return time;
        }
    }

    function updateField(field, callback) {
        var value = klynt.stats[field];
        klynt.stats[field] = callback(value);
    }
})(window.klynt);