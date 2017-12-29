let config = {
    eln: '#asdfasdksjdlfkajsldkfjasd',
    data: this.ovntopoData,
    height: `${height - 200}px`,                                                                            
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

this.dataFlow = new DataFlow(config);