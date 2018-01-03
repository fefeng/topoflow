import TopoFlow from './topoflow/index.js';
import './index.scss'
class Index {
    constructor() {
        this.data = {                      // 默认图形数据
            nodes: [{
                id: 'router1',
                type: 'router',
                x: 300,
                y: 150,
                config: {}
            }, {
                id: 'switch2',
                type: 'switch',
                x: 300,
                y: 300,
                config: {}
            }, {
                id: 'vdi1',
                type: 'vdi',
                x: 200,
                y: 450,
                config: {}
            }, {
                id: 'server1',
                type: 'server',
                x: 500,
                y: 450,
                config: {}
            }],
            links: [{
                from: 'router1',
                to: 'switch2'
            }, {
                from: 'vdi1',
                to: 'switch2'
            }, {
                from: 'server1',
                to: 'switch2'
            }]
        }
    }

    initTopoFlow() {
        let config = {
            eln: '#topoflow1',
            data: this.data,
            height: `700px`,
            // 模板
            nodeTemplate: {
                router: {
                    width: 90,
                    height: 50,
                    deleteAble: true,
                    operatingPoint: ['left', 'right'],
                    renderNode: (node, nodeInfo) => {
                        node.append('svg:rect')
                            .style('fill', 'white')
                            .style('stroke', '#27af7d')
                            .attr('height', nodeInfo.height)
                            .attr('width', nodeInfo.width)
                        node.append('text')
                            .attr('x', 10)
                            .attr('y', 40)
                            .html(nodeInfo.id)
                    }
                },
                switch: {
                    width: 140,
                    height: 50,
                    deleteAble: true,
                    operatingPoint: [
                        'left', 'right'
                    ],
                    renderNode: (node, nodeInfo) => {
                        node.append('svg:rect')
                            .style('fill', 'white')
                            .style('stroke', '#27af7d')
                            .attr('height', nodeInfo.height)
                            .attr('width', nodeInfo.width)

                        node.append('text')
                            .attr('x', 10)
                            .attr('y', 40)
                            .html(nodeInfo.id)
                    }
                },
                server: {
                    width: 50,
                    height: 100,
                    deleteAble: true,
                    operatingPoint: [
                        'left', 'right'
                    ],
                    renderNode: (node, nodeInfo) => {
                        node.append('svg:rect')
                            .style('fill', 'white')
                            .style('stroke', '#27af7d')
                            .attr('height', nodeInfo.height)
                            .attr('width', nodeInfo.width)

                        node.append('text')
                            .attr('x', 10)
                            .attr('y', 40)
                            .html(nodeInfo.id)
                    }
                },
                vdi: {
                    width: 50,
                    height: 50,
                    deleteAble: true,
                    operatingPoint: ['left', 'right'],
                    renderNode: (node, nodeInfo) => {
                        node.append('svg:rect')
                            .style('fill', 'white')
                            .style('stroke', '#27af7d')
                            .attr('height', nodeInfo.height)
                            .attr('width', nodeInfo.width)

                        node.append('text')
                            .attr('x', 10)
                            .attr('y', 40)
                            .html(nodeInfo.id)
                    }
                }
            },
            onSelectNode: (eln, node) => {
                console.log('onSelectNode', eln, node);
            },
            onClearActiveElement: () => {
            },
            onNodeContextMenuRender: (nodeInfo) => {
                if ('router' === nodeInfo.type) {
                    return [
                        { label: '配置', action: 'r_setup' },
                        { label: '详情', action: 'r_detail' },
                    ];
                } else if ('switch' === nodeInfo.type) {
                    return [
                        { label: '配置', action: 's_setup' },
                        { label: '详情', action: 's_detail' },
                    ];
                } else if ('host' === nodeInfo.type) {
                    return [
                        { label: '配置', action: 'h_setup' },
                        { label: '详情', action: 'h_detail' },
                    ];
                }
                return null;
            },
            contextmenuClick: (node, action) => {
                console.log('menu click', node, action);
            },
            onChange: data => {
                console.log('data change', data);
            },
        };
        this.topoFlow = new TopoFlow(config);
    }
};

let index = new Index();
index.initTopoFlow();