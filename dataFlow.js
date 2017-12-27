import * as d3 from 'd3';

import contextmenu from './lib/contextmenu';
import mathLib from './lib/math';
import common from './lib/common';

import './index.scss';
export default class Flow {
    // 设置默认值
    constructor(config) {
        this.config = config; // 初始化配置参数

        this.Nodes = {}; // 当前画布中的节点信息(实时更新)
        this.Links = {}; // 当前画布的线条信息
        this.sourceNode = {}; //  源节点信息               
        this.selectedElement = null; //当前选中节点的ID
        this.optionGroup = null;  // 操作按钮元素
        this.deleteAbleType = [];    //  允许删除的元素
        this.currentMouseXY = {};

        this.svgID = `svg_${common.genUUID()}`; // svg的ID
        this.rwaElnContainer = document.querySelector(this.config.eln);

        this.initContextMenu()

        // 初始化画布
        this.svg = d3
            .select(config.eln)
            .style('outline', 'none')
            .attr('tabIndex', '0')
            .append('svg')
            .attr('id', this.svgID)
            .attr('width', '100%')
            .attr('height', this.config.height);

        // 初始化路径组信息
        this.pathGroup = this.svg.append('svg:g').attr('class', 'data-flow-path-group');
        this.nodeGroup = this.svg.append('svg:g').attr('class', 'data-flow-node-group');
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
        this.config.onDataChange();
    }

    // 组件初始化方法调用
    init() {
        this.initDefs();
        this.initSvgEvent();

        let nodeTypeList = Object.keys(this.config.template);
        nodeTypeList.map((type) => {
            let template = this.config.template[type];
            if (!!template.deleteAble) {
                this.deleteAbleType.push(type);
            }
        });
    }

    // 初始化定义元素，如箭头
    initDefs() {
        let defs = this.svg.append('svg:defs');

        defs.attr('id', 'arrow-defs')
            .append('svg:marker')
            .attr('id', 'start-arrow')
            .attr('viewBox', '0 -5 10 10')
            .attr('refX', -5)
            .attr('refY', 2)
            .attr('markerWidth', 10)
            .attr('markerHeight', 10)
            .attr('orient', 'auto')
            .append('svg:circle')
            .style('stroke-width', '1px')
            .attr('cx', 3)
            .attr('cy', 2)
            .attr('r', 1);

        defs.attr('id', 'arrow-defs')
            .append('svg:marker')
            .attr('id', 'end-arrow')
            .attr('viewBox', '0 -5 10 10')
            .attr('refX', 10)
            .attr('refY', 2)
            .attr('markerWidth', 10)
            .attr('markerHeight', 10)
            .attr('orient', 'auto')
            .append('svg:circle')
            .style('stroke-width', '1px')
            .attr('cx', 3)
            .attr('cy', 2)
            .attr('r', 1);

        this.dragLine = this.pathGroup
            .append('svg:path')
            .attr('id', 'drag-line')
            .style('fill', 'white')
            .style('marker-end', 'url(#end-arrow)')
            .attr('class', 'dragline hide')
            .attr('d', 'M0,0L0,0');
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

                    then.sourceNode = {};
                    then.onDataChange();
                });


            // 节点拖拽事件
            let nodeMouseXY = [];
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

            // 删除节点和线条的快捷键
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

        if (this.deleteAbleType.indexOf(node.templateType) === -1) {
            console.log('Not allowed to delete type ' + node.templateType);
            return false;
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
        this.clearAllActiveElement();
        let nodeInfo = this.Nodes[nodeID];
        nodeInfo.selected = true;
        d3.select(`#${nodeID}`).classed('active', true);
        this.selectedElement = {
            type: 'node',
            id: nodeID
        };
    }

    // 新增一个节点
    addNode(nodeInfo) {
        let then = this;

        if (!!!nodeInfo.id) {
            nodeInfo.id = 'node_' + common.genUUID();
        }

        let node = this.nodeGroup
            .append('g')
            .attr('class', 'node')
            .attr('id', nodeInfo.id)
            .on('contextmenu', function () {
                d3.event.preventDefault();
                then.contextmenu.show(nodeInfo, then.currentMouseXY);
            })
            .on('click', function () {
                then.selectNode(nodeInfo.id);
                then.onNodeClick(node, nodeInfo);
                then.config.onSelectNode(this, nodeInfo);
            })
            .attr('transform', `translate(${nodeInfo.x}, ${nodeInfo.y})`);

        if (!!this.dragEvent) {
            node.call(this.dragEvent);
        }

        // 调用参数定义的        
        this.config.template[nodeInfo.templateType].renderNode(node, nodeInfo);

        // 保存节点信息        
        this.Nodes[nodeInfo.id] = nodeInfo;
        this.onDataChange();
        return nodeInfo;
    }

    onNodeClick(node, nodeInfo) {
        let then = this;
        let nodeShape = this.config.template[nodeInfo.templateType].shape;

        this.sourceNode = nodeInfo;
        this.optionGroup = this.nodeGroup.append('g');

        if (!!!this.config.readOnly) {
            this.config.template[nodeInfo.templateType].operatingPoint.forEach((item) => {
                then.optionGroup
                    .append('svg:circle')
                    .attr('class', 'operating-point')
                    .attr('r', 5)
                    .attr('fill', 'white')
                    .attr('stroke', '#06a0e9')
                    .attr('transform', () => {
                        if (nodeShape === 'circle') {
                            if (item === 'right') {
                                return `translate(${nodeInfo.width + nodeInfo.x},${nodeInfo.y})`;
                            } else if (item === 'left') {
                                return `translate(${(nodeInfo.x - nodeInfo.width)},${nodeInfo.y})`;
                            }
                        } else if (nodeShape === 'rect') {
                            if (item === 'right') {
                                return `translate(${nodeInfo.x + nodeInfo.width}, ${nodeInfo.y + nodeInfo.height / 2})`;
                            } else if (item === 'left') {
                                return `translate(${nodeInfo.x}, ${nodeInfo.y + nodeInfo.height / 2})`;
                            }
                        }
                    }).call(then.DragLinkEvent);
            });

            // 删除按钮
            if (nodeShape === 'rect') {
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
                    console.log('delete node', nodeInfo);
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

        d3.select(`#${linkID}`).attr('d', `M${points[0]},${points[1]}L${points[2]}, ${points[3]}`);
    }

    // 增加线条
    addLink(sourceNode, targetNode) {
        let then = this;
        let gid = 'link_' + common.genUUID();
        let points = mathLib.calculateLinkPoint(sourceNode, targetNode, this.config);

        let path = this.pathGroup.append('svg:path');

        path
            .attr('id', gid)
            .style('marker-start', 'url(#start-arrow)')
            .style('marker-end', 'url(#end-arrow)')
            .attr('class', 'link')
            .attr('d', `M${points[0]}, ${points[1]}L${points[2]}, ${points[3]}`)
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

        this.onDataChange();
    }

    deleteLink(link) {
        delete this.Links[link.id];
        d3.select(`#${link.id}`).remove();
        this.onDataChange();
    }
}