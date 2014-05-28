/**
 * Copyright 2014, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 *
 * This file contains the implementation of the metadata module.
 * */

(function (klynt) {
    var DATABASE_NAME = 'klynt';
    var DATABASE_SIZE = 10 * 1024 * 1024;

    var searchEngine;

    var accessors = {
        get tags() {
            var tagsSet = {};
            klynt.sequences.list.forEach(function addSequenceTagsToSet(sequence) {
                sequence.tags.forEach(function addTagToSet(tag) {
                    tagsSet[tag] = true;
                });
            });
            return setToArray(tagsSet);
        },

        get projectTitle() {
            return klynt.data.general.title || "";
        },

        get projectDescription() {
            return klynt.data.general.description || "";
        },

        get projectKeywords() {
            return klynt.data.general.keywords || "";
        },

        get projectAuthor() {
            return klynt.data.general.author || "";
        },

        get socialDescription() {
            return klynt.data.share.message || "";
        },

        get socialTitle() {
            return klynt.data.share.title || "";
        },

        get socialLink() {
            return klynt.data.share.link || klynt.utils.localURL();
        },

        get socialImage() {
            return klynt.data.share.thumbnail;
        }

    };

    klynt.getModule('metadata', accessors).expose(init, findSequencesByTags, findSequencesByTag, findSequencesByText, findSequencesByTitle, findSequencesByContent);

    function init() {
        document.title = klynt.metadata.projectTitle;
        replaceMetaDataByName('description', klynt.metadata.projectDescription);
        replaceMetaDataByName('keywords', klynt.metadata.projectKeywords);
        replaceMetaDataByName('author', klynt.metadata.projectAuthor);
        replaceMetaDataByProperty('og:title', klynt.metadata.socialTitle);
        replaceMetaDataByProperty('og:url', klynt.metadata.socialLink);
        replaceMetaDataByProperty('og:description', klynt.metadata.socialDescription);
        replaceMetaDataByProperty('og:image', klynt.metadata.socialImage);
        // searchEngine = initEngine();
    }

    function replaceMetaDataByName(name, value) {
        $('meta[name=' + name + ']').remove();
        $('head').append('<meta name="' + name + '" content="' + value + '">');
    }

    function replaceMetaDataByProperty(name, value) {
        $('meta[property="' + name + '"]').remove();
        $('head').append('<meta property="' + name + '" content="' + value + '">');
    }

    function findSequencesByTags(tags) {
        return klynt.sequences.list.filter(hasTags);

        var sequence_tag;
        var pattern;
        var match;

        function hasTags(sequence) {
            for (var i = 0; i < tags.length; i++) {
                for (var j = 0; j < sequence.tags.length; j++) {
                    sequenceTag = sequence.tags[j];
                    pattern = new RegExp('^' + tags[i], 'gi');
                    match = sequenceTag.match(pattern);
                    if (match) {
                        return true;
                    }
                }
            }
            return false;
        }
    }

    function findSequencesByTag(tag) {
        return findSequencesByTags([tag]);
    }

    function findSequencesByText(text) {
        var pattern = new RegExp('(^|[^a-zA-Z0-9])' + text, 'gi');
        var match;
        var description;
        var resultSet = [];
        klynt.sequences.list.filter(function (list) {
            description = list.description;
            match = description.match(pattern);
            if (match) {
                resultSet.push(list);
            }
        });
        return (resultSet);
    }

    function findSequencesByTitle(text) {
        var pattern = new RegExp('(^|[^a-zA-Z0-9])' + text, 'gi');
        var match;
        var title;
        var resultSet = [];
        klynt.sequences.list.filter(function (list) {
            title = list.title;
            match = title.match(pattern);
            if (match) {
                resultSet.push(list);
            }
        });
        return (resultSet);
    }

    function findSequencesByContent(text) {
        var pattern = new RegExp('(^|[^a-zA-Z0-9])' + text, 'gi');
        var match;
        var resultSet = [];
        klynt.sequences.list.filter(function (list) {
            list.texts.filter(function (content) {
                content = content.rawContent;
                match = content.match(pattern);
                if (match) {
                    resultSet.push(list);
                }
            });
        });
        return (resultSet);
    }

    function initEngine() {
        var searchEngine = new fullproof.BooleanEngine();

        var index = {
            name: 'stemmedindex',
            analyzer: new fullproof.StandardAnalyzer(fullproof.normalizer.to_lowercase_nomark, fullproof.english.metaphone),
            capabilities: new fullproof.Capabilities()
                .setStoreObjects(true)
                .setUseScores(false)
                .setDbName(DATABASE_NAME)
                .setDbSize(DATABASE_SIZE),
            initializer: initData
        };

        searchEngine.open(index, onEngineReady, onEngineError);
        return searchEngine;
    }

    function initData(injector, callback) {
        var sequenceTexts = getSequencesTexts();
        var synchroPoint = fullproof.make_synchro_point(callback, sequenceTexts.length);
        sequenceTexts.forEach(function injectText(text) {
            injector.inject(text.text, text.sequence.id, synchroPoint);
        });
    }

    function getSequencesTexts() {
        var sequenceTexts = [];
        klynt.sequences.list.forEach(function indexSequence(sequence) {
            sequence.texts.forEach(function indexText(text) {
                sequenceTexts.push({
                    sequence: sequence,
                    text: text.rawContent
                });
            });
        });
        return sequenceTexts;
    }

    function setToArray(dataSet) {
        var result = [];
        for (var key in dataSet) {
            if (dataSet.hasOwnProperty(key)) {
                result.push(key);
            }
        }
        return result;
    }

    function onEngineReady() {}

    function onEngineError() {}
})(window.klynt);