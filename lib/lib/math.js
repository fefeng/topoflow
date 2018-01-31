"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = {
    // 获取节点间的位置信息
    getPoint: function getPoint(j, d) {
        var c = d,
            e = {
            x: j.x + j.width / 2,
            y: j.y + j.height / 2
        };
        var l = (e.y - c.y) / (e.x - c.x);
        l = isNaN(l) ? 0 : l;
        var k = j.height / j.width;
        var h = c.y < e.y ? -1 : 1,
            f = c.x < e.x ? -1 : 1,
            g = void 0,
            i = void 0;
        if (Math.abs(l) > k && h === -1) {
            g = e.y - j.height / 2;
            i = e.x + h * j.height / 2 / l;
        } else {
            if (Math.abs(l) > k && h === 1) {
                g = e.y + j.height / 2;
                i = e.x + h * j.height / 2 / l;
            } else {
                if (Math.abs(l) < k && f === -1) {
                    g = e.y + f * j.width / 2 * l;
                    i = e.x - j.width / 2;
                } else {
                    if (Math.abs(l) < k && f === 1) {
                        g = e.y + j.width / 2 * l;
                        i = e.x + j.width / 2;
                    }
                }
            }
        }
        var position = {
            x: i,
            y: g
        };
        return position;
    },


    // 计算两个节点之间线条的坐标信息
    calculateLinkPoint: function calculateLinkPoint(sourceNode, targetNode, config) {
        var offset = 10;
        if (!sourceNode || !targetNode) {
            return [];
        }
        var startNodeInfo = {
            x: sourceNode.x - offset / 2,
            y: sourceNode.y - offset / 2,
            width: sourceNode.width + offset,
            height: sourceNode.height + offset
        };

        var endNodeInfo = {
            x: targetNode.x - offset / 2,
            y: targetNode.y - offset / 2,
            width: targetNode.width + offset,
            height: targetNode.height + offset
        };

        var startPoint = this.getPoint(startNodeInfo, {
            x: endNodeInfo.x + endNodeInfo.width / 2,
            y: endNodeInfo.y + endNodeInfo.height / 2
        });
        var endPoint = this.getPoint(endNodeInfo, startPoint);
        return [startPoint.x, startPoint.y, endPoint.x, endPoint.y];
    }
};
//# sourceMappingURL=math.js.map