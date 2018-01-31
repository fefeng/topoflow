import * as d3 from 'd3';

import contextmenu from './lib/contextmenu';
import mathLib from './lib/math';
import common from './lib/common';

import './styles/index.css';

export default class Flow {
    // 设置默认值
    constructor(config) {
        this.config = config; // 初始化配置参数

        this.Nodes = {}; // 当前画布中的节点信息(实时更新)
        this.Links = {}; // 当前画布的线条信息
        this.sourceNode = {}; //  源节点信息               
        this.selectedElement = null; //当前选中节点的ID
        this.optionGroup = null;  // 操作按钮元素        
        this.currentMouseXY = {};
        this.isSetData = false; // 是否是回填数据模式
        this.rwaElnContainer = document.querySelector(this.config.eln);

        this.rwaElnContainer.classList.add('topoflow-container');

        if (this.config.hasOwnProperty('onNodeContextMenuRender')) {
            this.initContextMenu();
        }

        // 初始化画布
        this.svg = d3
            .select(config.eln)
            .style('outline', 'none')
            .attr('tabIndex', '0')
            .append('svg')
            .attr('id', `svg_${common.genUUID()}`)
            .attr('width', '100%')
            .attr('height', this.config.height);

        // 初始化路径组信息
        this.pathGroup = this.svg.append('svg:g').attr('class', 'data-flow-path-group');
        this.nodeGroup = this.svg.append('svg:g').attr('class', 'data-flow-node-group');
    }

    // 组件初始化方法调用
    init() {
        this.initDefs();
        this.initSvgEvent();
    }


    initContextMenu() {
        // 初始化右键菜单
        this.contextmenu = new contextmenu({
            render: this.config.onNodeContextMenuRender.bind(this),
            container: this.rwaElnContainer,
            onClick: (nodeInfo, iteminfo) => {
                if (!!this.config.contextmenuClick) {
                    this.config.contextmenuClick.call(this, nodeInfo, iteminfo);
                }
            }
        });
    }

    // 当图形发生变更的时候进行图形的变化
    onDataChange() {
        if (!this.isSetData && this.config.hasOwnProperty('onDataChange')) {
            this.config.onDataChange();
        }
    }

    // 初始化定义元素，如箭头
    initDefs() {
        let defs = this.svg.append('svg:defs').attr('id', 'arrow-defs');

        // 自定义
        if (this.config.hasOwnProperty('linkTemplate') && this.config.linkTemplate.hasOwnProperty('defs')) {
            this.config.linkTemplate.defs(defs);
        } else {
            defs.append('svg:marker')
                .attr('id', 'end-arrow')
                .attr('viewBox', '0 -5 10 10')
                .attr('refX', 6)
                .attr('markerWidth', 5)
                .attr('markerHeight', 5)
                .attr('orient', 'auto')
                .append('svg:path')
                .attr('d', 'M0,-5L10,0L0,5');
        }

        this.dragLine = this.pathGroup.append('svg:path');
        if (this.config.hasOwnProperty('linkTemplate') && this.config.linkTemplate.hasOwnProperty('dragLink')) {
            this.config.linkTemplate.dragLink(this.dragLine)
        } else {
            this.dragLine.style('fill', 'white').style('marker-end', 'url(#end-arrow)').attr('class', 'dragline hide').attr('d', 'M0,0L0,0');
        }
    }

    // 重置，将会删掉所有的线条和节点
    reset() {
        if (this.rwaElnContainer !== null) {
            let pathGroup = this.rwaElnContainer.querySelector('.data-flow-path-group');
            if (!!pathGroup) {
                pathGroup.innerHTML = '';
            }
            let nodeGroup = this.rwaElnContainer.querySelector('.data-flow-node-group');
            if (!!nodeGroup) {
                nodeGroup.innerHTML = '';
            }

            let arrowDefsDom = this.rwaElnContainer.querySelector('#arrow-defs');
            if (!!arrowDefsDom) {
                arrowDefsDom.remove();
            }
        }
        this.Nodes = [];
        this.Links = [];
        this.initDefs();
        this.onDataChange();
    }

    // 清理所有选中的元素信息
    clearAllActiveElement() {

        this.selectedElement = null;

        d3.selectAll('.link').style('marker-end', 'url(#end-arrow)');
        d3.selectAll('.node').classed('active', false);
        d3.selectAll('.link').classed('active', false);

        if (!!this.optionGroup) {
            this.optionGroup.remove();
        }

        if (!!this.config.onClearActiveElement) {
            this.config.onClearActiveElement();
        }

        let nodes = this.Nodes;
        let nodeIDs = Object.keys(nodes);

        nodeIDs.map(item => {
            this.Nodes[item].selected = false;
        });
        this.onDataChange();
    }

    zoom() {
        let then = this;

        // 画布移动缩放        
        let zoom = d3.zoom().on('zoom', function () {
            d3.selectAll(`${then.config.eln} .data-flow-path-group, ${then.config.eln} .data-flow-node-group`).attr('transform', d3.event.transform);
        });

        // 限制缩放的范围
        zoom.scaleExtent([0.7, 1.5]);

        // 使用移动和缩放并禁用双击
        this.svg.call(zoom).on('dblclick.zoom', null);
    }

    // svg画布的事件绑定
    initSvgEvent() {
        let then = this;

        this.zoom();

        if (!!!this.config.readOnly) {
            this.svg.on('mousemove', function () {
                let xy = d3.mouse(this);
                then.currentMouseXY = {
                    x: xy[0],
                    y: xy[1]
                };
            });

            // 鼠标线条的操作
            let linkPoint = [0, 0, 0, 0];
            this.DragLinkEvent = d3.drag()
                .on('start', function (d) {     // 设置线条的起始点
                    linkPoint = [d3.event.x, d3.event.y];
                    then.sourceNode = then.Nodes[then.selectedElement.id];
                })
                .on('drag', function (d) {      // 线条跟随鼠标位置
                    linkPoint[2] = d3.event.x;
                    linkPoint[3] = d3.event.y;
                    then.dragLine.classed('hide', false).attr('d', `M${linkPoint[0]},${linkPoint[1]}L${linkPoint[2]},${linkPoint[3]}`);
                })
                .on('end', function () {
                    then.dragLine.classed('hide', true);
                    let classList = d3.event.sourceEvent.target.parentNode.classList;
                    let flag = 0;
                    classList.forEach(v => {
                        if (v === 'data-flow-path-group') {
                            flag = 1;
                        } else if (v === 'node') {
                            flag = 2;
                        }
                    });

                    if (flag === 2) {
                        let nodeID = d3.event.sourceEvent.target.parentNode.id;
                        let targetNode = then.Nodes[nodeID];
                        then.addLink(then.sourceNode, targetNode);
                    }
                    if (then.config.hasOwnProperty('onDragLink')) {
                        let point = [d3.event.x, d3.event.y];
                        then.config.onDragLink(then.sourceNode, point, flag === 2);
                    }

                    then.sourceNode = {};
                    then.onDataChange();
                });

            this.nodaDrag();
            this.hotKey();
        }
    }

    // 节点拖拽事件
    nodaDrag() {
        let nodeMouseXY = [];
        let then = this;
        this.dragEvent = d3.drag()
            .on('start', function () {
                nodeMouseXY = d3.mouse(this);
                if (!!then.optionGroup) {
                    then.optionGroup.remove();
                }
            })
            .on('drag', function (d) {
                let point = {
                    x: d3.event.x - nodeMouseXY[0],
                    y: d3.event.y - nodeMouseXY[1]
                };

                d3.select(this).attr('transform', `translate(${point.x},${point.y})`);

                // 移动节点,线条跟着变化
                let nodeID = this.id;

                then.Nodes[nodeID].x = point.x;
                then.Nodes[nodeID].y = point.y;

                let linksID = Object.keys(then.Links);
                linksID.map(linkID => {
                    let link = then.Links[linkID];
                    if (nodeID === link.from || nodeID === link.to) {
                        then.moveLink(link, linkID);
                    }
                });
            })
            .on('end', function () {
                then.onDataChange();
            });
    }

    // 删除节点和线条的快捷键
    hotKey() {
        let then = this;
        document.querySelector(this.config.eln).addEventListener('keydown', function (e) {
            if (!!then.selectedElement && (e.keyCode === 8 || e.keyCode === 46)) {
                if (then.selectedElement.type === 'node') {
                    then.deleteNode(then.selectedElement.id);
                } else {
                    let link = then.Links[then.selectedElement.id];
                    then.deleteLink(link);
                }
            }
        });
    }

    // 删除节点
    deleteNode(nodeID) {
        let node = this.Nodes[nodeID];
        if (!!!node) {
            return false;
        }

        if (this.config.hasOwnProperty('onDeleteNode')) {
            if (!this.config.onDeleteNode(node)) {
                return;
            }
        }

        delete this.Nodes[nodeID];
        d3.select('#' + nodeID).remove();

        let linksID = Object.keys(this.Links);
        linksID.map((linkID) => {
            let link = this.Links[linkID];
            if (link.from === nodeID || link.to === nodeID) {
                this.deleteLink(link);
            }
        });

        if (!!this.optionGroup) {
            this.optionGroup.remove();
        }

        this.onDataChange();
    }

    // 选中节点
    selectNode(nodeID) {
        this.clearAllActiveElement()
        let nodeInfo = this.Nodes[nodeID];
        nodeInfo.selected = true;

        let node = d3.select(`#${nodeID}`);
        node.classed('active', true)

        this.selectedElement = {
            type: 'node',
            id: nodeID
        };
        this.onNodeClick(node, nodeInfo)
    }

    // 新增一个节点
    addNode(nodeInfo) {
        let then = this;

        if (!!!nodeInfo.id) {
            nodeInfo.id = 'node_' + common.genUUID();
        }

        if (!this.config.nodeTemplate.hasOwnProperty(nodeInfo.type)) {
            return;
        }

        let template = this.config.nodeTemplate[nodeInfo.type];

        nodeInfo.width = template.width;
        nodeInfo.height = template.height;

        let node = this.nodeGroup
            .append('g')
            .attr('class', 'node')
            .attr('id', nodeInfo.id)
            .on('contextmenu', function () {
                d3.event.preventDefault();
                if (then.config.hasOwnProperty('onNodeContextMenuRender')) {
                    then.contextmenu.show(nodeInfo, then.currentMouseXY);
                }
            })
            .on('click', function () {
                then.config.onSelectNode(this, nodeInfo);
                then.selectNode(nodeInfo.id);
                then.onNodeClick(node, nodeInfo);
            })
            .attr('transform', `translate(${nodeInfo.x}, ${nodeInfo.y})`);


        if (!!this.dragEvent) {
            node.call(this.dragEvent);
        }

        // 调用参数定义的        
        this.config.nodeTemplate[nodeInfo.type].renderNode(node, nodeInfo);

        // 保存节点信息        
        this.Nodes[nodeInfo.id] = nodeInfo;
        this.onDataChange();
        return nodeInfo;
    }

    onNodeClick(node, nodeInfo) {
        let then = this;
        this.sourceNode = nodeInfo;
        let template = this.config.nodeTemplate[nodeInfo.type];
        if (!template) {
            console.warn(`${nodeInfo.type} template not found `);
            return;
        }

        if (!!this.optionGroup) {
            this.optionGroup.remove();
        }

        this.optionGroup = this.nodeGroup.append('g');
        if (!!!this.config.readOnly) {
            this.optionGroup.append('rect')
                .style('fill', 'none')
                .style('stroke', '#68a987')
                .style('stroke-width', '1px')
                .attr('width', nodeInfo.width)
                .attr('height', nodeInfo.height)
                .attr('transform', `translate(${nodeInfo.x}, ${nodeInfo.y}) `);

            template.operatingPoint.forEach((item) => {
                then.optionGroup
                    .append('svg:circle')
                    .attr('class', 'operating-point')
                    .attr('r', 5)
                    .attr('fill', 'white')
                    .attr('stroke', '#06a0e9')
                    .attr('transform', () => {
                        if (item === 'right') {
                            return `translate(${nodeInfo.x + nodeInfo.width}, ${nodeInfo.y + nodeInfo.height / 2})`;
                        } else if (item === 'left') {
                            return `translate(${nodeInfo.x}, ${nodeInfo.y + nodeInfo.height / 2})`;
                        }
                    }).call(then.DragLinkEvent);
            });

            if (template.deleteAble) {
                // 删除按钮
                let del_btn = this.optionGroup
                    .append('g')
                    .attr('class', 'delete-not-btn')
                    .attr('transform', `translate(${nodeInfo.width + nodeInfo.x}, ${nodeInfo.y}) `);

                del_btn
                    .append('svg:circle')
                    .attr('stroke', 'red')
                    .attr('fill', 'red')
                    .attr('r', 6);

                del_btn
                    .append('svg:path')
                    .attr('stroke', 'white')
                    .attr('stroke-width', 2)
                    .attr('d', 'M-3,-3L3,3');

                del_btn
                    .append('svg:path')
                    .attr('stroke', 'white')
                    .attr('stroke-width', 2)
                    .attr('d', 'M3,-3L-3,3');

                del_btn.on('click', function () {
                    then.deleteNode(nodeInfo.id);
                });
            }
        }
    }

    // 移动节点的时候节点相关的线条跟着移动
    moveLink(link, linkID) {
        let sourceNode = this.Nodes[link.from];
        let targetNode = this.Nodes[link.to];

        let points = mathLib.calculateLinkPoint(sourceNode, targetNode, this.config);
        if (points.length === 4) {
            d3.select(`#${linkID}`).attr('d', `M${points[0]},${points[1]}L${points[2]}, ${points[3]}`);
        }

    }

    // 增加线条
    addLink(sourceNode, targetNode) {
        let then = this;
        let gid = 'link_' + common.genUUID();
        let points = mathLib.calculateLinkPoint(sourceNode, targetNode, this.config);

        if (points.length !== 4) {
            return;
        }

        let path = this.pathGroup.append('svg:path').attr('id', gid).attr('class', 'link');

        if (this.config.hasOwnProperty('linkTemplate') && this.config.linkTemplate.hasOwnProperty('path')) {
            this.config.linkTemplate.path(path);
        } else {
            path.style('marker-end', 'url(#end-arrow)')
        }

        path.attr('d', `M${points[0]}, ${points[1]}L${points[2]}, ${points[3]}`)
            .on('click', () => {
                then.clearAllActiveElement();
                path.classed('active', true);
                then.selectedElement = {
                    type: 'link',
                    id: gid
                };
            });

        this.Links[gid] = {
            id: gid,
            from: sourceNode.id,
            to: targetNode.id
        };

        if (!this.isSetData && this.config.hasOwnProperty('onConnect')) {
            this.config.onConnect(sourceNode, targetNode);
        }
        this.onDataChange();
    }

    deleteLink(link) {
        delete this.Links[link.id];
        d3.select(`#${link.id}`).remove();
        this.onDataChange();
    }
}