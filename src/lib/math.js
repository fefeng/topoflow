export default {
    // 获取节点间的位置信息
    getPoint(j, d) {
        let c = d,
            e = {
                x: j.x + j.width / 2,
                y: j.y + j.height / 2
            };
        let l = (e.y - c.y) / (e.x - c.x);
        l = isNaN(l) ?
            0 :
            l;
        let k = j.height / j.width;
        let h = c.y < e.y ?
            -1 :
            1,
            f = c.x < e.x ?
                -1 :
                1,
            g,
            i;
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
        let position = {
            x: i,
            y: g
        };
        return position;
    },

    // 计算两个节点之间线条的坐标信息
    calculateLinkPoint(sourceNode, targetNode, config) {
        let offset = 10;
        let endNodeInfo = {};
        let startNodeInfo = {};
        let sourceShapeType = config.nodeTemplate[sourceNode.type].shape;
        let targetShapeType = config.nodeTemplate[targetNode.type].shape;

        if (sourceShapeType === 'circle') {
            startNodeInfo = {
                x: (sourceNode.x - sourceNode.width) - offset / 2,
                y: (sourceNode.y - sourceNode.height) - offset / 2,
                width: sourceNode.width * 2 + offset,
                height: sourceNode.height * 2 + offset
            };
        } else {
            startNodeInfo = {
                x: sourceNode.x - offset / 2,
                y: sourceNode.y - offset / 2,
                width: sourceNode.width + offset,
                height: sourceNode.height + offset
            };
        }

        if (targetShapeType === 'circle') {
            endNodeInfo = {
                x: (targetNode.x - targetNode.width) - offset / 2,
                y: (targetNode.y - targetNode.height) - offset / 2,
                width: targetNode.width * 2 + offset,
                height: targetNode.height * 2 + offset
            };
        } else {
            endNodeInfo = {
                x: targetNode.x - offset / 2,
                y: targetNode.y - offset / 2,
                width: targetNode.width + offset,
                height: targetNode.height + offset
            };
        }

        let startPoint = this.getPoint(startNodeInfo, {
            x: endNodeInfo.x + endNodeInfo.width / 2,
            y: endNodeInfo.y + endNodeInfo.height / 2
        });
        let endPoint = this.getPoint(endNodeInfo, startPoint);
        return [startPoint.x, startPoint.y, endPoint.x, endPoint.y];
    }
}