(function () {
    sigma.utils.pkg('sigma.canvas.hovers');
    sigma.canvas.hovers.klynt = function (node, context, settings) {
        var x,
            y,
            w,
            h,
            e,
            fontStyle = settings('hoverFontStyle') || settings('fontStyle'),
            prefix = settings('prefix') || '',
            size = node[prefix + 'size'],
            fontSize = (settings('labelSize') === 'fixed') ?
                settings('defaultLabelSize') :
                settings('labelSizeRatio') * size;

        if (size < 10) {
            return;
        }

        // Label background:
        context.font = (fontStyle ? fontStyle + ' ' : '') +
            fontSize + 'px ' + (settings('hoverFont') || settings('font'));

        context.beginPath();
        context.fillStyle = settings('labelHoverBGColor') === 'node' ?
            (node.color || settings('defaultNodeColor')) :
            settings('defaultHoverLabelBGColor');

        if (settings('labelHoverShadow')) {
            context.shadowOffsetX = node.shadowX;
            context.shadowOffsetY = node.shadowY;
            context.shadowBlur = node.shadowBlur;
            // context.shadowColor = settings('labelHoverShadowColor');
            context.shadowColor = node.shadowColor;
        }

        var labelWidth = context.measureText(node.label).width;
        var labelX = node[prefix + 'x'] - (labelWidth / 2);
        var labelY = node[prefix + 'y'] - size * 1.2;

        // Node border:
        if (settings('borderSize') > 0) {
            context.beginPath();
            context.fillStyle = settings('nodeBorderColor') === 'node' ?
                (node.color || settings('defaultNodeColor')) :
                settings('defaultNodeBorderColor');
            context.arc(
                node[prefix + 'x'],
                node[prefix + 'y'],
                size + settings('borderSize'),
                0,
                Math.PI * 2,
                true
            );
            context.closePath();
            context.fill();
        }

        // Node:
        var nodeRenderer = sigma.canvas.nodes[node.type] || sigma.canvas.nodes.def;
        nodeRenderer(node, context, settings, 'true');

        // Display the label:
        if (typeof node.label === 'string') {
            context.fillStyle = (settings('labelHoverColor') === 'node') ?
                (node.color || settings('defaultNodeColor')) :
                settings('defaultLabelHoverColor');

            var x = node[prefix + 'x'];
            var y = node[prefix + 'y'];

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
        }
    };
})();