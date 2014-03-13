(function () {
    sigma.utils.pkg('sigma.canvas.labels');
    sigma.canvas.labels.klynt = function (node, context, settings) {
        var fontSize,
            prefix = settings('prefix') || '',
            size = node[prefix + 'size'];

        if (size < settings('labelThreshold'))
            return;

        if (typeof node.label !== 'string')
            return;

        fontSize = (settings('labelSize') === 'fixed') ?
            settings('defaultLabelSize') :
            settings('labelSizeRatio') * size;

        context.font = (settings('fontStyle') ? settings('fontStyle') + ' ' : '') +
            fontSize + 'px ' + settings('font');
        context.fillStyle = (settings('labelColor') === 'node') ?
            (node.color || settings('defaultNodeColor')) :
            settings('defaultLabelColor');

        var x = node[prefix + 'x'] + node.dx;
        var y = node[prefix + 'y'] + node.dy;

        var tabLabel = node.label.split('//');
        var tabLength = tabLabel.length;
        var widthLabel;

        for (var i = 0; i < tabLength; i++) {

            widthLabel = context.measureText(tabLabel[i]);

            context.fillText(
                tabLabel[i],
                Math.round(x) - (widthLabel.width / 2),
                Math.round(y) - size * 1.2 - (tabLength - i - 1) * fontSize
            );
        }
    };
})();