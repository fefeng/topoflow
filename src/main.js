import TopoFlow from './index';
class Index {
    constructor() {
        console.log(1);
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
            eln: '#topoflow',
            data: this.data,
            height: `500px`,
            // 模板
            nodeTemplate: {
                router: {
                    width: 90,
                    height: 50,
                    deleteAble: true,
                    operatingPoint: ['left', 'right'],
                    renderNode: (node, nodeInfo) => {
                        node.append('svg:image')
                            .attr('href', 'static/images/ovn/router.png')
                            .attr('height', nodeInfo.height)
                            .attr('width', nodeInfo.width)
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
                        node.append('svg:image')
                            .attr('href', 'static/images/ovn/switch.png')
                            .attr('height', nodeInfo.height)
                            .attr('width', nodeInfo.width)
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
                        node.append('svg:image')
                            .attr('href', 'static/images/ovn/vserver.png')
                            .attr('height', nodeInfo.height)
                            .attr('width', nodeInfo.width)
                    }
                },
                vdi: {
                    width: 50,
                    height: 50,
                    deleteAble: true,
                    operatingPoint: ['left', 'right'],
                    renderNode: (node, nodeInfo) => {
                        node.append('svg:image')
                            .attr('href', 'static/images/ovn/vdi.png')
                            .attr('height', nodeInfo.height)
                            .attr('width', nodeInfo.width)
                    }
                }
            },
            onSelectNode: (eln, node) => {
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
                this.contextmenuClick(node, action);
            },
            onChange: (data) => {
                // this.ovntopoData = data;
            },
        };

        this.dataFlow = new TopoFlow(config);
    }
};

let index = new Index();
index.initTopoFlow();