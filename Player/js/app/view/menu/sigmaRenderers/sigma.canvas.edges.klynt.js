(function () {
    var EPSILON = 0.0001;
    var ARROW_SHARPNESS = 25 * Math.PI / 180;
    var INTERSECTION_PRECISION = 1;
    var INTERSECTION_MAX_ITERATIONS = 10;
    var label;

    sigma.utils.pkg('sigma.canvas.edges');
    sigma.canvas.edges.klynt = function (edge, sourceNode, targetNode, context, settings) {
        var prefix = settings('prefix') || '';
        var sourceSize = sourceNode[prefix + 'size'];
        var targetSize = targetNode[prefix + 'size'];
        var fontSize = (settings('labelSize') === 'fixed') ? settings('defaultLabelSize') : settings('labelSizeRatio') * size;
        label = labelCoordinatesEdges(targetNode.label, targetNode[prefix + 'x'], targetNode[prefix + 'y'], targetNode[prefix + 'size']);

        context.beginPath();

        context.font = (settings('fontStyle') ? settings('fontStyle') + ' ' : '') + fontSize + 'px ' + settings('font');

        var originalCurve = {
            source: {
                x: sourceNode[prefix + 'x'] + sourceNode.dx,
                y: sourceNode[prefix + 'y'] + sourceNode.dy
            },
            target: {
                x: targetNode[prefix + 'x'] + targetNode.dx,
                y: targetNode[prefix + 'y'] + targetNode.dy
            }
        }
        originalCurve.control = getControlPoint(originalCurve.source, originalCurve.target, edge.controlDX, edge.controlDY);

        var curve = getCurveCroppedByCircles(originalCurve, sourceSize, targetSize);

        if (curve) {
            // Setup context
            context.globalAlpha = edge.opacity;
            context.strokeStyle = edge.color;
            context.lineWidth = settings('linesThickness');

            // Draw curve
            context.beginPath();
            context.moveTo(curve.source.x, curve.source.y);
            context.quadraticCurveTo(curve.control.x, curve.control.y, curve.target.x, curve.target.y);
            context.stroke();

            // Draw arrow
            if (edge.arrow) {
                var arrowExtremities = getArrowExtremities(curve, ARROW_SHARPNESS, settings('arrowSize'));

                context.beginPath();
                context.moveTo(arrowExtremities.p1.x, arrowExtremities.p1.y);
                context.lineTo(arrowExtremities.p0.x, arrowExtremities.p0.y);
                context.lineTo(arrowExtremities.p2.x, arrowExtremities.p2.y);
                context.stroke();
            }

            // Reset context
            context.globalAlpha = 1;
        }

        function labelCoordinatesEdges(label, x, y, size) {
            if (!label) {
                return null;
            }

            var spacing = 3;

            var tabLabel = label.split('//'),
                width = 0,
                label = [],
                left = y,
                widthLabel,
                labelLeft,
                labelTop;

            if (settings('proportionalLabel')) {
                fontSize = (fontSize * size) / settings('labelSizeRatio');
            }

            for (var i = 0; i < tabLabel.length; i++) {
                widthLabel = context.measureText(tabLabel[i]);

                labelLeft = Math.round(x) - (widthLabel.width / 2);
                labelTop = Math.round(y) + size + (i + 1) * fontSize - (fontSize / 2) + i * spacing;

                if (labelLeft < left) {
                    left = labelLeft;
                }
                if (widthLabel.width > width) {
                    width = widthLabel.width;
                }
            }

            var horizontalMargin = fontSize / 4,
                verticalMargin = fontSize / 8,
                rightMargin = 0,
                bottomMargin = spacing;

            return {
                x: x - (width / 2) - horizontalMargin,
                y: y + size - verticalMargin - (fontSize / 2),
                width: width + (2 * horizontalMargin) + rightMargin,
                height: tabLabel.length * fontSize * 1.2 + (2 * verticalMargin) + bottomMargin
            };
        }
    };

    function getControlPoint(source, target, controlDX, controlDY) {
        var middle = {
            x: (source.x + target.x) / 2,
            y: (source.y + target.y) / 2
        };
        var xVector = {
            x: target.x - middle.x,
            y: target.y - middle.y
        };
        var yVector = {
            x: xVector.y,
            y: -xVector.x
        };
        var halfWay = {
            x: middle.x + xVector.x * controlDX + yVector.x * controlDY,
            y: middle.y + xVector.y * controlDX + yVector.y * controlDY
        };

        return {
            x: 2 * halfWay.x - middle.x,
            y: 2 * halfWay.y - middle.y
        };
    }

    function getCurveCroppedByCircles(curve, sourceSize, targetSize) {
        if (getDistance(curve.source, curve.target) > sourceSize + targetSize) {
            var sourceIntersection = getCurveIntersectionWithCircle(curve, curve.source, sourceSize, 0, 1);
            var targetIntersection = getCurveIntersectionWithCircle(curve, curve.target, targetSize, 1, 0, label);

            if (sourceIntersection && targetIntersection) {
                return getPartialCurveBetweenPoints(curve, sourceIntersection, targetIntersection);
            }
        }

        return null;
    }

    function getCurveIntersectionWithCircle(curve, circleCenter, circleSize, minT, maxT, label) {
        var rectPoint = null;

        if (label) {
            var solutions = [].concat(
                getCurveIntersectionWithVerticalLine(curve, label.x, label.y, label.y + label.height),
                getCurveIntersectionWithVerticalLine(curve, label.x + label.width, label.y, label.y + label.height),
                getCurveIntersectionWithHorizontalLine(curve, label.y, label.x, label.x + label.width),
                getCurveIntersectionWithHorizontalLine(curve, label.y + label.height, label.x, label.x + label.width)
            );

            var solution;
            var minimalT = 1;

            for (var i = 0; i < solutions.length; i++) {
                solution = solutions[i];

                if (solution.t < minimalT) {
                    rectPoint = solution;
                    minimalT = solution.t;
                }
            }

            if (rectPoint != null) {
                return rectPoint;
            }
        }

        var t = 0.5;
        var continueLoop = true;
        var loopsCount = 0;

        do {
            var circlePoint = getCurvePointWithT(curve, t);
            var d = getDistance(circlePoint, circleCenter);

            if (Math.abs(d - circleSize) < INTERSECTION_PRECISION) {
                return circlePoint;
            }

            if (d < circleSize) {
                minT = t;
                t = (t + maxT) / 2;
            } else {
                maxT = t;
                t = (t + minT) / 2;
            }

        } while (loopsCount++ < INTERSECTION_MAX_ITERATIONS);

        return circlePoint;
    }

    function solveQuadraticEquation(a, b, c) {
        if (Math.abs(a) < 0.0001) {
            return [-c / b];
        }

        var disc = b * b - 4 * a * c;

        if (disc >= 0) {
            var sqrt = Math.sqrt(disc);
            return [(-b - sqrt) / 2 / a, (-b + sqrt) / 2 / a];
        }

        return null;
    }

    function getCurvePointWithT(curve, t) {
        var OneMinusT = 1 - t;

        var x = OneMinusT * OneMinusT * curve.source.x + 2 * t * OneMinusT * curve.control.x + t * t * curve.target.x;
        var y = OneMinusT * OneMinusT * curve.source.y + 2 * t * OneMinusT * curve.control.y + t * t * curve.target.y;

        return {
            x: x,
            y: y,
            t: t
        }
    }

    function getCurveIntersectionWithVerticalLine(curve, x, minY, maxY) {

        var a = curve.source.x - 2 * curve.control.x + curve.target.x;
        var b = -2 * (curve.source.x - curve.control.x);
        var c = curve.source.x - x;

        var solutions = solveQuadraticEquation(a, b, c);

        if (!solutions) {
            return [];
        }

        var points = [];
        for (var i = 0; i < solutions.length; i++) {
            var t = solutions[i];
            if (0 <= t && t <= 1) {
                var p = getCurvePointWithT(curve, t);
                if (p.y >= minY && p.y <= maxY) {
                    points.push(p);
                }
            }
        }

        return points;
    }

    function getCurveIntersectionWithHorizontalLine(curve, y, minX, maxX) {

        var a = curve.source.y - 2 * curve.control.y + curve.target.y;
        var b = -2 * (curve.source.y - curve.control.y);
        var c = curve.source.y - y;

        var solutions = solveQuadraticEquation(a, b, c);

        if (!solutions) {
            return [];
        }

        var points = [];
        for (var i = 0; i < solutions.length; i++) {
            var t = solutions[i];
            if (0 <= t && t <= 1) {
                var p = getCurvePointWithT(curve, t);
                if (p.x >= minX && p.x <= maxX) {
                    points.push(p);
                }
            }
        }

        return points;
    }

    function getPartialCurveBetweenPoints(curve, point1, point2) {
        if (point1.t > point2.t) {
            return null;
        }

        var middle = getCurvePointWithT(curve, (point1.t + point2.t) / 2);

        var curveHalves = getCurveHalvesWithT(curve, middle.t);

        var fullLeftHalf = curveHalves[0];
        var fullRightHalf = curveHalves[1];

        var fullLeftHalfHalves = getCurveHalvesWithT(fullLeftHalf, point1.t / middle.t);
        var fullRightHalfHalves = getCurveHalvesWithT(fullRightHalf, (point2.t - middle.t) / (1 - middle.t));

        return getCurveByJoiningCurves(fullLeftHalfHalves[1], fullRightHalfHalves[0]);
    }

    function getCurveHalvesWithT(curve, t) {
        var p = getCurvePointWithT(curve, t);

        var leftControlPoint = {
            x: (1 - t) * curve.source.x + t * curve.control.x,
            y: (1 - t) * curve.source.y + t * curve.control.y
        };
        var rightControlPoint = {
            x: (1 - t) * curve.control.x + t * curve.target.x,
            y: (1 - t) * curve.control.y + t * curve.target.y
        };

        return [{
            source: curve.source,
            control: leftControlPoint,
            target: p
        }, {
            source: p,
            control: rightControlPoint,
            target: curve.target
        }];
    }

    function getCurveByJoiningCurves(leftCurve, rightCurve) {
        var control = getIntersectionOfTwoLines(leftCurve.source, leftCurve.control, rightCurve.control, rightCurve.target);
        return {
            source: leftCurve.source,
            control: control || leftCurve.control,
            target: rightCurve.target
        };
    }

    function getIntersectionOfTwoLines(p1, p2, p3, p4) {
        var d = (p1.x - p2.x) * (p3.y - p4.y) - (p1.y - p2.y) * (p3.x - p4.x);

        return Math.abs(d) < EPSILON ? {
            x: (p1.x + p4.x) / 2,
            y: (p1.y + p4.y) / 2
        } : {
            x: ((p3.x - p4.x) * (p1.x * p2.y - p1.y * p2.x) - (p1.x - p2.x) * (p3.x * p4.y - p3.y * p4.x)) / d,
            y: ((p3.y - p4.y) * (p1.x * p2.y - p1.y * p2.x) - (p1.y - p2.y) * (p3.x * p4.y - p3.y * p4.x)) / d
        };
    }

    function getDistance(p1, p2) {
        return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
    }

    function getCurvePointWithT(curve, t) {
        var oneMinusT = 1 - t;

        return {
            x: oneMinusT * oneMinusT * curve.source.x + 2 * t * oneMinusT * curve.control.x + t * t * curve.target.x,
            y: oneMinusT * oneMinusT * curve.source.y + 2 * t * oneMinusT * curve.control.y + t * t * curve.target.y,
            t: t
        }
    }

    function getArrowExtremities(curve, sharpness, size) {
        var rotationAngle = computeAngle(curve.control, curve.target);

        return {
            p0: {
                x: curve.target.x,
                y: curve.target.y
            },
            p1: {
                x: curve.target.x + Math.cos(rotationAngle + sharpness) * size,
                y: curve.target.y + Math.sin(rotationAngle + sharpness) * size
            },
            p2: {
                x: curve.target.x + Math.cos(rotationAngle - sharpness) * size,
                y: curve.target.y + Math.sin(rotationAngle - sharpness) * size
            }
        };
    }

    function computeAngle(p1, p2) {
        return (p1.x <= p2.x ? Math.PI : 0) + Math.atan((p2.y - p1.y) / (p2.x - p1.x));
    }
})();