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

            if (settings('organicEffect')) {

                if (node.dxDirection === undefined) {
                    node.dxDirection = Math.random() < 0.5 ? 1 : -1;
                    node.dyDirection = Math.random() < 0.5 ? 1 : -1;
                }

                if (Math.random() > 0.96) {
                    node.dxDirection *= -1;
                }

                if (Math.random() > 0.96) {
                    node.dyDirection *= -1;
                }

                //var randomX = (Math.random() * 2) - 1;
                //var randomY = (Math.random() * 2) - 1;

                var randomX = node.dxDirection * (Math.random() * Math.random() * 1);
                var randomY = node.dyDirection * (Math.random() * Math.random() * 1);

                randomX *= size / 50;
                randomY *= size / 50;

                var distance = Math.sqrt(Math.pow(node.dx + randomX, 2) + Math.pow(node.dy + randomY, 2));

                if (distance > size * 1) {
                    node.dx -= randomX;
                    node.dy -= randomY;
                } else {
                    node.dx += randomX;
                    node.dy += randomY;
                }
            }

            // Draw the image
            if (img && size >= settings('imageThreshold')) {
                // Draw the clipping disc:
                context.beginPath();
                context.arc(
                    node[prefix + 'x'] + node.dx,
                    node[prefix + 'y'] + node.dy,
                    size,
                    0,
                    Math.PI * 2,
                    true
                );
                context.closePath();
                context.clip();

                var imageScale = size / Math.min(img.width, img.height);

                // Draw the image
                context.drawImage(
                    img,
                    node[prefix + 'x'] + node.dx - imageScale * img.width,
                    node[prefix + 'y'] + node.dy - imageScale * img.height,
                    2 * imageScale * img.width,
                    2 * imageScale * img.height
                );

                context.restore();
            }

            // Draw the border:
            context.beginPath();
            context.arc(
                node[prefix + 'x'] + node.dx,
                node[prefix + 'y'] + node.dy,
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

            var backupFont = context.font;

            if (node.viewed) {
                // context.fillStyle = 'rgba(0,0,0, 0.5)';
                // context.shadowOffsetX = 0;
                // context.shadowOffsetY = 0;
                // context.shadowBlur = 0;
                // context.shadowColor = 0;

                // context.arc(
                //     node[prefix + 'x'] + node.dx,
                //     node[prefix + 'y'] + node.dy,
                //     size,
                //     size,
                //     Math.PI * 2,
                //     true
                // );

                // context.fill();

                // draw disk for sequence state -> viewed or current
                // context.fillStyle = settings('primaryColor');
                context.fillStyle = '#FFFFFF';
                context.beginPath();

                context.arc(
                    node[prefix + 'x'] + size * Math.cos(Math.PI / 4),
                    node[prefix + 'y'] - size * Math.sin(Math.PI / 4),
                    size / 4,
                    0,
                    Math.PI * 2,
                    true
                );

                context.fill();
                context.closePath();

                //draw arc
                context.lineWidth = size * 0.025;
                // context.strokeStyle = settings('tertiaryColor');
                context.strokeStyle = node.color || settings('defaultNodeColor');
                context.beginPath();

                context.arc(
                    node[prefix + 'x'] + size * Math.cos(Math.PI / 4),
                    node[prefix + 'y'] - size * Math.sin(Math.PI / 4),
                    size / 4,
                    0,
                    Math.PI * 2,
                    true
                );

                context.stroke();
                context.closePath();

                context.beginPath();

                // context.fillStyle = settings('tertiaryColor');
                context.fillStyle = node.color || settings('defaultNodeColor');

                // avoid shadow on text
                context.shadowOffsetX = 0;
                context.shadowOffsetY = 0;
                context.shadowBlur = 0;
                context.shadowColor = 0;

                // draw character for sequence state -> || or ✓
                var fontSize = size * 0.3,
                    textWidth,
                    text = node.id == klynt.sequenceContainer.currentSequence.id ? 'p' : '✓';

                context.font = fontSize + 'px klynt-icons'

                textWidth = context.measureText(text);

                context.fillText(
                    text,
                    node[prefix + 'x'] + size * Math.cos(Math.PI / 4) - (textWidth.width / 2),
                    node[prefix + 'y'] - size * Math.sin(Math.PI / 4) + (fontSize / 2)
                );

                context.fillStyle = 'rgba(0,0,0, 0.5)';
                context.font = backupFont;

            }
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