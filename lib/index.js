'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _topoflow = require('./topoflow');

var _topoflow2 = _interopRequireDefault(_topoflow);

var _common = require('./lib/common');

var _common2 = _interopRequireDefault(_common);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// 封装外暴露的方法
var Index = function () {
    function Index(config) {
        _classCallCheck(this, Index);

        var obj = {};
        Object.assign(obj, config);

        this.config = obj;

        obj.onDataChange = this.onDataChange.bind(this);

        this.flow = new _topoflow2.default(obj);
        this.flow.init();
        this.drawFlow(this.config.data);
    }

    // 设置数据


    _createClass(Index, [{
        key: 'setData',
        value: function setData(data) {
            this.config.data = data;
            this.drawFlow(data);
        }

        // 渲染图形

    }, {
        key: 'drawFlow',
        value: function drawFlow() {
            var _this = this;

            var nodes = [];
            var links = [];
            this.flow.reset();

            try {
                nodes = this.config.data.nodes;
                links = this.config.data.links;
            } catch (e) {
                return false;
            }

            if (!!nodes && nodes.length > 0) {
                nodes.forEach(function (node) {
                    _this.flow.addNode(node);
                    if (node.selected) {
                        _this.selectNode(node.id);
                    }
                });
            }

            // 渲染链接
            if (!!links && links.length > 0) {
                links.forEach(function (link) {
                    _this.flow.addLink(_this.flow.Nodes[link.from], _this.flow.Nodes[link.to]);
                });
            }
        }

        // 选中一个节点

    }, {
        key: 'selectNode',
        value: function selectNode(nodeID) {
            this.flow.selectNode(nodeID);
        }

        // 新增节点

    }, {
        key: 'addNode',
        value: function addNode(nodeInfo) {
            return this.flow.addNode(nodeInfo);
        }

        // 新增线条

    }, {
        key: 'addLink',
        value: function addLink(sourceNode, targetNode) {
            this.flow.addLink(sourceNode, targetNode);
        }
    }, {
        key: 'getNodes',
        value: function getNodes() {
            var nodes = this.flow.Nodes;
            var nodesID = Object.keys(nodes);
            return nodesID.map(function (id) {
                nodes[id].x = Math.floor(nodes[id].x);
                nodes[id].y = Math.floor(nodes[id].y);
                return nodes[id];
            });
        }
    }, {
        key: 'onDataChange',
        value: function onDataChange() {
            var nodes = this.getNodes();
            var links = this.getLinks();

            if (!!this.config.onChange) {
                this.config.onChange({
                    nodes: nodes,
                    links: links
                });
            }
        }
    }, {
        key: 'getLinks',
        value: function getLinks() {
            var links = this.flow.Links;
            var linksID = Object.keys(links);
            return linksID.map(function (id) {
                return links[id];
            });
        }
    }, {
        key: 'genUUID',
        value: function genUUID() {
            return _common2.default.genUUID();
        }
    }]);

    return Index;
}();

exports.default = Index;
//# sourceMappingURL=index.js.map