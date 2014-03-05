(function () {
    sigma.utils.pkg('sigma.canvas.edges');
    sigma.canvas.edges.klynt = function (edge, source, target, context, settings) {
        var color = edge.color,
            opacity = edge.opacity,
            prefix = settings('prefix') || '',
            edgeColor = settings('edgeColor'),
            defaultNodeColor = settings('defaultNodeColor'),
            defaultEdgeColor = settings('defaultEdgeColor'),
            sourceSize = source[prefix + 'size']
            targetSize = target[prefix + 'size'];

        if (!color) {
            switch (edgeColor) {
            case 'source':
                color = source.color || defaultNodeColor;
                break;
            case 'target':
                color = target.color || defaultNodeColor;
                break;
            default:
                color = defaultEdgeColor;
                break;
            }
        }

        var origin = {
            x: source[prefix + 'x'],
            y: source[prefix + 'y']
        };
        var destination = {
            x: target[prefix + 'x'],
            y: target[prefix + 'y']
        };
        var halfWay = {
            x: (origin.x + destination.x) / 2,
            y: (origin.y + destination.y) / 2
        };
        var xVector = {
            x: destination.x - halfWay.x,
            y: destination.y - halfWay.y
        };
        var yVector = {
            x: xVector.y,
            y: -xVector.x
        };
        var curveHandler = {
            x: halfWay.x + xVector.x * edge.controlDX + yVector.x * edge.controlDY,
            y: halfWay.y + xVector.y * edge.controlDX + yVector.y * edge.controlDY
        };
        var curveAnchor = {
            x: 2 * curveHandler.x - halfWay.x,
            y: 2 * curveHandler.y - halfWay.y
        };

        var nodesCircleDistance = Math.sqrt(Math.pow(origin.x - destination.x, 2) + Math.pow(origin.y - destination.y, 2)) - (sourceSize + targetSize);

        if (nodesCircleDistance > 0) {

            var start = intersection(destination, origin, curveAnchor, sourceSize);
            var end = intersection(origin, destination, curveAnchor, targetSize);
            var t = (start.t + end.t) / 2;
            var c1 = contactPosition(t, start, curveAnchor);
            var c2 = contactPosition(t, curveAnchor, destination);
            var d1 = edges(origin, c1);
            var d2 = edges(c2, destination);
            var coords = d1.a == d2.a ? middle(c1, c2) : edgesIntersection(d1, d2);

            /* DRAW LINE */
            context.globalAlpha = opacity;
            context.strokeStyle = color;
            context.lineWidth = settings('linesThickness');
            context.beginPath();
            context.moveTo(start.x, start.y);
            context.quadraticCurveTo(
                coords.x,
                coords.y,
                end.x,
                end.y
            );
            context.stroke();

            /* DRAW ARROW */

            if (edge.arrow) {

                var rotationAngle = computeAngle(coords, end);

                var ARROW_SHARPNESS = 25;

                var size = settings('arrowSize');

                var x0 = end.x;
                var y0 = end.y;

                var x1 = x0 + Math.cos(0.017453292519943295 * (ARROW_SHARPNESS + rotationAngle)) * size;
                var y1 = y0 + Math.sin(0.017453292519943295 * (ARROW_SHARPNESS + rotationAngle)) * size;
                var x2 = x0 + Math.cos(0.017453292519943295 * (rotationAngle - ARROW_SHARPNESS)) * size;
                var y2 = y0 + Math.sin(0.017453292519943295 * (rotationAngle - ARROW_SHARPNESS)) * size;

                context.beginPath();
                context.moveTo(x1, y1);
                context.lineTo(x0, y0);
                context.lineTo(x2, y2);
                context.stroke();
            }

        }

        context.globalAlpha = 1;

        function intersection(origin, destination, contact, size) {

            var d;
            var t = 0.5;
            var minT = 0;
            var maxT = 1;
            var point = {};
            var test = true;
            var i = 0;

            do {
                point = ratioPosition(origin, contact, destination, t);

                d = Math.sqrt(Math.pow(point.x - destination.x, 2) + Math.pow(point.y - destination.y, 2));

                if (Math.abs(d - size) < 2 || i > 9) {
                    test = false;
                } else if (d > size) {
                    minT = t;
                    t = (t + maxT) / 2;
                } else {
                    maxT = t;
                    t = (t + minT) / 2;
                }
                i++;
            } while (test);

            point.t = t;

            return point;

            function ratioPosition(origin, contact, destination, t) {
                var a = Math.pow((1 - t), 2);
                var b = Math.pow(t, 2);

                var x = a * origin.x + 2 * (1 - t) * t * contact.x + b * destination.x;
                var y = a * origin.y + 2 * (1 - t) * t * contact.y + b * destination.y;

                return {
                    x: x,
                    y: y
                }
            }
        }

        function contactPosition(t, p1, p2) {
            return {
                x: (1 - t) * p1.x + t * p2.x,
                y: (1 - t) * p1.y + t * p2.y
            }
        }

        function edges(p1, p2) {
            var a = p1.x > p2.x ? (p2.y - p1.y) / (p2.x - p1.x) : (p1.y - p2.y) / (p1.x - p2.x);
            var b = p1.y - (a * p1.x);

            return {
                a: Math.round(a * 100) / 100,
                b: Math.round(b * 100) / 100
            };
        }

        function edgesIntersection(d1, d2) {
            var x = (d2.b - d1.b) / (d1.a - d2.a);

            return {
                x: x,
                y: x * d1.a + d1.b
            };
        }

        function middle(p1, p2) {
            return {
                x: (p1.x + p2.x) / 2,
                y: (p1.y + p2.y) / 2
            };
        }

        function computeAngle(p1, p2) {
            return (p1.x <= p2.x ? 180 : 0) + Math.atan(((p2.y - p1.y) / (p2.x - p1.x))) * 180 / Math.PI;
        }
    };
})();