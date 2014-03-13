(function () {
    var EPSILON = 0.0001;
    var ARROW_SHARPNESS = 25 * Math.PI / 180;
    var INTERSECTION_PRECISION = 1;
    var INTERSECTION_MAX_ITERATIONS = 10;

    sigma.utils.pkg('sigma.canvas.edges');
    sigma.canvas.edges.klynt = function (edge, sourceNode, targetNode, context, settings) {
        var prefix = settings('prefix') || '';
        var sourceSize = sourceNode[prefix + 'size'];
        var targetSize = targetNode[prefix + 'size'];

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
            var targetIntersection = getCurveIntersectionWithCircle(curve, curve.target, targetSize, 1, 0);

            if (sourceIntersection && targetIntersection) {
                return getPartialCurveBetweenPoints(curve, sourceIntersection, targetIntersection);
            }
        }

        return null;
    }

    function getCurveIntersectionWithCircle(curve, circleCenter, circleSize, minT, maxT) {
        var t = 0.5;
        var continueLoop = true;
        var loopsCount = 0;

        do {
            var point = getCurvePointWithT(curve, t);
            var d = getDistance(point, circleCenter);

            if (Math.abs(d - circleSize) < INTERSECTION_PRECISION) {
                return point;
            }

            if (d < circleSize) {
                minT = t;
                t = (t + maxT) / 2;
            } else {
                maxT = t;
                t = (t + minT) / 2;
            }
        } while (loopsCount++ < INTERSECTION_MAX_ITERATIONS);

        return point;
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