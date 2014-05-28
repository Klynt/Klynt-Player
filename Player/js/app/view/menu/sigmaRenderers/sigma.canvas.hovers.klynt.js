(function () {
    sigma.utils.pkg('sigma.canvas.hovers');
    sigma.canvas.hovers.klynt = function (node, context, settings) {
        var fontStyle = settings('hoverFontStyle') || settings('fontStyle'),
            fontSize = (settings('labelSize') === 'fixed') ? settings('defaultLabelSize') : settings('labelSizeRatio') * size,
            prefix = settings('prefix') || '',
            size = node[prefix + 'size'],
            x = node[prefix + 'x'],
            y = node[prefix + 'y'],
            label;

        if (size < 10) {
            return;
        }

        if (settings('proportionalLabel')) {
            fontSize = (fontSize * size) / settings('labelSizeRatio');
        }

        // Label background:
        context.font = (fontStyle ? fontStyle + ' ' : '') + fontSize + 'px ' + (settings('hoverFont') || settings('font'));
        context.beginPath();
        context.fillStyle = settings('labelColor') === 'node' ? (node.color || settings('defaultNodeColor')) : settings('defaultHoverLabelBGColor');

        if (settings('labelHoverShadow')) {
            context.shadowOffsetX = settings('shadowX');
            context.shadowOffsetY = settings('shadowY');
            context.shadowBlur = settings('shadowBlur');
            context.shadowColor = settings('shadowColor');
        }

        // Node:
        var nodeRenderer = sigma.canvas.nodes[node.type] || sigma.canvas.nodes.def;
        nodeRenderer(node, context, settings, 'true');

        // change of fillstyle to white ? //
        context.fillStyle = settings('labelColor') === 'node' ? (node.color || settings('defaultNodeColor')) : settings('defaultHoverLabelBGColor');

        // Display the label:
        if (typeof node.label === 'string') {

            label = labelCoordinates(context, size, fontSize, node.label, x, y);
            drawBackground(context, size, fontSize, x, y, label['width'], label['nbLines']);

            context.shadowOffsetX = 0;
            context.shadowOffsetY = 0;
            context.shadowBlur = 0;
            context.shadowColor = 0;

            drawLabel(context, label);
        }
    };

    var spacing = 3;

    function labelCoordinates(context, size, fontSize, label, x, y) {

        var tabLabel = label.split('//'),
            maxWidth = 0,
            label = [],
            left = y,
            widthLabel,
            labelLeft,
            labelTop;

        for (var i = 0; i < tabLabel.length; i++) {
            widthLabel = context.measureText(tabLabel[i]);

            labelLeft = Math.round(x) - (widthLabel.width / 2);
            labelTop = Math.round(y) + size + (i + 1) * fontSize - (fontSize / 2) + i * spacing;

            if (labelLeft < left) {
                left = labelLeft;
            }
            if (widthLabel.width > maxWidth) {
                maxWidth = widthLabel.width;
            }

            label[i] = [];
            label[i][0] = tabLabel[i];
            label[i][1] = labelLeft;
            label[i][2] = labelTop;
        }

        label['width'] = maxWidth;
        label['nbLines'] = tabLabel.length;

        return label;
    }

    function drawBackground(context, size, fontSize, x, y, width, nbLines) {

        var horizontalMargin = fontSize / 4,
            verticalMargin = fontSize / 8,
            rightMargin = 0,
            bottomMargin = spacing;

        context.beginPath();

        context.fillRect(
            x - (width / 2) - horizontalMargin,
            y + size - verticalMargin - (fontSize / 2),
            width + (2 * horizontalMargin) + rightMargin,
            nbLines * fontSize * 1.2 + (2 * verticalMargin) + bottomMargin
        );

    }

    function drawLabel(context, label) {

        context.fillStyle = '#ffffff';

        for (var i = 0; i < label.length; i++) {
            context.fillText(
                label[i][0],
                label[i][1],
                label[i][2]
            );
        }
    }
})();