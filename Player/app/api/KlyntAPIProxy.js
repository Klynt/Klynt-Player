(function(){

    var DEFINE = 'define';
   	var CHILD_READY = 'childReady';
   	var COMMAND = 'command';
   	var NOTIFICATION =	'notification';
   	var QUERY = 'query';
    var DEFINITIONS_COMPLETE = 'definitionsComplete';
    var CHILD = 'child';
    var PARENT = 'parent';

    var domain = '*';
    var children = {};

    window.addEventListener('message', function(event){
        var data = getEventData(event);
        if (!data || !data.header)
            return;

        if (isChildRegistering())
            registerChild(data.header.id, event.source);
        forwardData(data, event.data);

        function isChildRegistering(){
            return (data.header.type == CHILD_READY && data.header.id);
        }

        function registerChild(apiId, contentWindow){
            children[apiId] = contentWindow;
        }

        function forwardData(data, rawData){
            switch (data.header.destination){
                case PARENT:
                    return forwardToParent(data, rawData);
                case CHILD:
                    return forwardToChildren(data, rawData);
            }
        }
    })

    parent.addEventListener('message', function(event){
        var data = getEventData(event);
        if (data && data.header && data.header.destination == CHILD)
            forwardToChildren(data, event.data);
    })

    function getEventData(event){
        try { return JSON.parse(event.data); }
        catch (e){ return null; }
    }

    function forwardToParent(data, rawData){
        parent.postMessage(rawData, domain);
    }

    function forwardToChildren(data, rawData){
        (data.header.target)? forwardToSingleChild() : forwardToAllChildren();

        function forwardToSingleChild(){
            var target = children[data.header.target];
            if (target)
                target.postMessage(rawData, domain);
        }

        function forwardToAllChildren(){
            for (var id in children)
                children[id].postMessage(rawData, domain);
        }
    }

})();