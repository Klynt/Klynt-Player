/**
 * Copyright 2014, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 *
 * This file contains the implementation of the sequences module which contains utility functions to retrieve lists of
 * sequences according to given parameters such as the array of sequences that correspond to an array of ids.
 * */

(function (klynt) {
    var sequencesMap = null;
    var sequencesArray = null;
    var mainSequence = null;
    var startupSequence = null;

    var accessors = {
        get list() {
            return sequencesArray || [];
        },

        /* Main sequence defined in the project's data file */
        get mainSequence() {
            return mainSequence;
        },

        /* The startup sequence launched after the splashscreen.It is defined by the url hash, and defaults to
        the mainSequence if there is no hash.*/
        get startupSequence() {
            return startupSequence;
        },

        get index() {
            return this.list.filter(hasIndex).sort(function (a, b) {
                return a.index - b.index;
            });
        },

        get map() {
            return this.list.filter(isGeolocated);
        },

        get viewed() {
            return this.list.filter(isSequenceViewed);
        },

        get duration() {
            return this.list.reduce(sumDuration, 0);
        }
    };

    klynt.getModule('sequences', accessors)
        .expose(init, find, findAll)
        .expose(getSequenceIdByAlias, getAliasBySequenceId);

    function init() {
        sequencesMap = wrap(klynt.data.sequences);
        sequencesArray = mapToArray(sequencesMap);
        mainSequence = find(klynt.data.mainSequence);
        startupSequence = find(klynt.hashtag.toSequenceId()) || klynt.sequences.mainSequence;
    }

    function findAll(sequences) {
        return (sequences || []).map(find).filter(notNull);
    }

    function find(sequence) {
        if (typeof sequence === 'string') {
            return sequencesMap[sequence] || sequencesMap[getSequenceIdByAlias(sequence)];
        } else {
            return sequence;
        }
    }

    function getSequenceIdByAlias(alias) {
        return klynt.data.aliases.aliasToId[alias];
    }

    function getAliasBySequenceId(sequenceId) {
        return klynt.data.aliases.idToAlias[sequenceId];
    }

    function wrap(sequencesMap) {
        var result = {};
        for (var key in sequencesMap) {
            if (sequencesMap.hasOwnProperty(key)) {
                result[key] = new klynt.Sequence(sequencesMap[key]);
            }
        }
        return result;
    }

    function mapToArray(map) {
        var result = [];
        for (var key in map) {
            if (map.hasOwnProperty(key)) {
                result.push(map[key]);
            }
        }
        return result;
    }

    function hasIndex(sequence) {
        return sequence.index !== -1;
    }

    function isGeolocated(sequence) {
        return sequence.geolocated === true;
    }

    function isSequenceViewed(sequence) {
        return sequence.viewed;
    }

    function sumDuration(result, sequence) {
        return result + sequence.duration;
    }

    function notNull(sequence) {
        return !!sequence;
    }
})(window.klynt);
