```js
let config = {
    eln: '#asdfasdksjdlfkajsldkfjasd',
    data: this.ovntopoData,
    width: '100%',
    height: ,
    // 模板
    template: {
        router: {
            shape: 'rect',
            deleteAble: true,
            operatingPoint: ['left', 'right'],
            node: (node, nodeInfo) => {
                node.append('svg:image')
                    .attr('href', 'static/images/ovn/router.png')
                    .attr('height', nodeInfo.height)
                    .attr('width', nodeInfo.width)
            }
        },
        switch: {
            shape: 'rect',
            deleteAble: true,
            operatingPoint: [
                'left', 'right'
            ],
            node: (node, nodeInfo) => {
                node.append('svg:image')
                    .attr('href', 'static/images/ovn/switch.png')
                    .attr('height', nodeInfo.height)
                    .attr('width', nodeInfo.width)
            }
        },
        server: {
            shape: 'rect',
            deleteAble: true,
            operatingPoint: [
                'left', 'right'
            ],
            node: (node, nodeInfo) => {
                node.append('svg:image')
                    .attr('href', 'static/images/ovn/vserver.png')
                    .attr('height', nodeInfo.height)
                    .attr('width', nodeInfo.width)
            }
        },
        host: {
            shape: 'rect',
            deleteAble: true,
            operatingPoint: [
                'left', 'right'
            ],
            node: (node, nodeInfo) => {
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
        if ('router' === nodeInfo.config.type) {
            return [
                { label: '配置', action: 'r_setup' },
                { label: '详情', action: 'r_detail' },
            ];
        } else if ('switch' === nodeInfo.config.type) {
            return [
                { label: '配置', action: 's_setup' },
                { label: '详情', action: 's_detail' },
            ];
        } else if ('host' === nodeInfo.config.type) {
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
        this.ovntopoData = data;
    },
};

this.dataFlow = new DataFlow(config);
```