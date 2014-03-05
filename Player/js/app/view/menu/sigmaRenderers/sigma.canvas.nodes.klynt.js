(function () {
    sigma.utils.pkg('sigma.canvas.nodes');
    sigma.canvas.nodes.klynt = (function () {
        var _cache = {},
            _loading = {},
            _callbacks = {};

        // Return the renderer itself:
        var renderer = function (node, context, settings, hover) {
            var args = arguments,
                prefix = settings('prefix') || '',
                size = node[prefix + 'size'],
                color = node.color || settings('defaultNodeColor'),
                url = node.url,
                img = _cache[url];

            if (!img && url) {
                sigma.canvas.nodes.klynt.cache(url);
            }

            context.save();

            if (node.viewed || hover) {
                context.globalAlpha = 1;
            } else {
                context.globalAlpha = settings('nodesOpacity');
            }

            // Draw the image
            if (img && size >= settings('imageThreshold')) {
                // Draw the clipping disc:
                context.beginPath();
                context.arc(
                    node[prefix + 'x'],
                    node[prefix + 'y'],
                    size,
                    0,
                    Math.PI * 2,
                    true
                );
                context.closePath();
                context.clip();

                var imageScale = size / Math.min(img.width, img.height);

                // Draw the image

                context.imageSmoothingEnabled = false;
                context.mozImageSmoothingEnabled = false;
                context.webkitImageSmoothingEnabled = false;

                context.drawImage(
                    img,
                    node[prefix + 'x'] - imageScale * img.width,
                    node[prefix + 'y'] - imageScale * img.height,
                    2 * imageScale * img.width,
                    2 * imageScale * img.height
                );

                context.restore();
            }

            // Draw the border:
            context.beginPath();
            context.arc(
                node[prefix + 'x'],
                node[prefix + 'y'],
                size,
                0,
                Math.PI * 2,
                true
            );

            var borderWidth = settings('borderWidth');
            if (borderWidth != 0) {
                context.lineWidth = borderWidth;
                context.strokeStyle = node.color || settings('defaultNodeColor');
                context.stroke();
            }

            // Fill color for sequences without image or with a small node renderer
            if (!img || size < settings('imageThreshold')) {
                context.fillStyle = node.color || settings('defaultNodeColor');
                context.fill();
            }

            if (node.viewed) {
                context.fillStyle = 'rgba(0,0,0, 0.5)';

                context.arc(
                    node[prefix + 'x'],
                    node[prefix + 'y'],
                    size,
                    size,
                    Math.PI * 2,
                    true
                );

                context.fill();
            }

            var contextFont = context.font;

            if (node.id == klynt.sequenceContainer.currentSequence.id) {

                var fontSize = size * 0.8;

                context.font = fontSize + 'px klynt-icons'
                context.fillStyle = '#ffffff';

                var textWidth = context.measureText('p');

                context.fillText(
                    'p',
                    node[prefix + 'x'] - (textWidth.width / 2),
                    node[prefix + 'y'] + (fontSize / 2)
                );

            }

            context.font = contextFont;
        };

        // Let's add a public method to cache images, to make it possible to
        // preload images before the initial rendering:
        renderer.cache = function (url, callback) {
            if (callback)
                _callbacks[url] = callback;

            if (_loading[url])
                return;

            var img = new Image();

            img.onload = function () {
                _loading[url] = false;
                _cache[url] = img;

                if (_callbacks[url]) {
                    _callbacks[url].call(this, img);
                    delete _callbacks[url];
                }
            };

            _loading[url] = true;
            img.src = url;
        };

        return renderer;
    })();
})();