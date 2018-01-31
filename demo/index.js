import TopoFlow from '../lib';
// import TopoFlow from '../src';
import './index.scss'

class Index {
    constructor() {
        this.data = {                      // 默认图形数据
            nodes: [{
                id: 'router1',
                type: 'router',
                x: 300,
                y: 150,
                config: { name: "router1" }
            }, {
                id: 'switch2',
                type: 'switch',
                x: 300,
                y: 300,
                config: { name: "switch2" }
            }, {
                id: 'server1',
                type: 'server',
                x: 500,
                y: 450,
                config: { name: "server1" }
            }, {
                id: 'server2',
                type: 'server',
                x: 200,
                y: 450,
                config: { name: "server2" }
            }],
            links: [{
                from: 'router1',
                to: 'switch2'
            }, {
                from: 'server1',
                to: 'switch2'
            }, {
                from: 'server2',
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
                            .html(nodeInfo.config.name);
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
                            .html(nodeInfo.config.name);
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
                            .html(nodeInfo.config.name);
                    }
                }
            },
            onSelectNode: (eln, node) => {
                console.log('onSelectNode', eln, node);
            },
            onClearActiveElement: () => {
                console.log('清空所有选中状态');
            },
            onNodeContextMenuRender: (nodeInfo) => {

                return [{ label: '配置', action: 'h_setup' },
                { label: '详情', action: 'h_detail' }];
            },
            contextmenuClick: (node, action) => {
                alert(`触发了节点[${node.config.name}]的[${action.label}]菜单`)
                console.log('menu click', node, action);
            },
            onChange: data => {
                console.log('data change', data);
            },
            onConnect: (source,target) => {
                console.log('on connect', source,target);
            }
        };
        this.topoFlow = new TopoFlow(config);

    }
    initDemoEvent() {
        // 创建节点
        document.querySelector('#addNode').addEventListener('click', () => {
            let nodeType = document.querySelector('#node-type').value;
            let name = document.querySelector('#node-name').value || `${nodeType}_${Math.floor(Math.random() * 1000)}`;
            this.topoFlow.addNode({
                type: nodeType,
                x: 100,
                y: 100,
                config: { name }
            });
        });

        // 创建节点
        document.querySelector('#btn2').addEventListener('click', () => {

            let node1 = this.topoFlow.addNode({
                type: 'router',
                x: 100,
                y: 100,
                config: { name: 'node1' }
            });

            let node2 = this.topoFlow.addNode({
                type: 'router',
                x: 400,
                y: 100,
                config: { name: 'node2' }
            });
            this.topoFlow.addLink(node1, node2)
        });
    }
};

let index = new Index();
index.initTopoFlow();
index.initDemoEvent();