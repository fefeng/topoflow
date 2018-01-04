## topoflow

#### 基础概念说明

- 节点(node)为实际的场景中的逻辑实例,例如网络中的一台交换机,路由器,防火墙等等.

- 线(link):关联两个节点,并维护两个节点之间的关系.

  ​

#### 功能说明

topoflow是一个基于[d3](https://d3js.org/)的一个拓扑图插件,提供了以下功能.

1. 通过画布可以拖拽节点.

2. 画布中两个节点之间可以连线.

3. 画布中的节点和线条可进行缩放和一定.

4. 提供了丰富的对外暴露的方法和事件,适用各种适用场景.

5. 针对每个节点提供了右键菜单,适用于不同节点类型.

   ​


目前该类的组件也有,但是很多无法满足各种需求,主要以下两点:

1. 并未提供丰富的方法和事件,使得使用场景单一.
2. 样式无法修改.

该项目是根据本人的在多个实际项目需求开发,并将其开源,因本人时间和能力有限,可能会存在些许bug,欢迎提交issues.



#### 使用例子
[在线demo](https://fefeng.github.io/)

![](./images/s1.png)



![](./images/s2.png)

#### 使用说明

亲测,适用于`react`和`vue`

- react项目中初始化过程应该在`componentDidMount` 生命周期内完成

- vue项目中的初始化过程应该在`mounted`的生命周期内完成

  ​


- 安装依赖

```bash
npm i topoflow --save-dev
```

- html

```html
<div id="topoflow"></div>
```

- 初始化

```js
import TopoFlow from 'topoflow';

let data = {                      // 默认图形数据
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
};

let config = {        
    eln: '#topoflow1',
    data: this.data,
    height: '700px',    
    nodeTemplate: {
        // 对应的nodes信息数据结构中的type字段
        router: {
            width: 90,
            height: 50,
            deleteAble: true,
            // 操作点的位置
            operatingPoint: ['left', 'right'],
            renderNode: (node, nodeInfo) => {
                // node 为d3的的svg dom实例。具体使用方式请参考d3文档
                // nodeInfo 为节点的实际配置信息
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
        return [{ label: '配置', action: 'h_setup' },{ label: '详情', action: 'h_detail' }];
    },
    contextmenuClick: (node, action) => {
        alert(`触发了节点[${node.config.name}]的[${action.label}]菜单`)        
    },
    onChange: data => {
        console.log('data change', data);
    },
};

// 初始化
let topoflow = new TopoFlow(config);

// 新建node1
let node1 = topoFlow.addNode({
    type: nodeType,
    x: 100,
    y: 100,
    config: { xxx }
});

// 新建node2
let node2 = topoFlow.addNode({
    type: nodeType,
    x: 200,
    y: 200,
    config: { xxx }
});

// 将node1和node2相连
topoFlow.addLink(node1, node2);
```



#### 属性

| 属性名                         | 属性说明                       |
| --------------------------- | -------------------------- |
| eln                         | 用于生成图形的div属性一般为div|class  |
| data                        | 图形的数据                      |
| height                      | 画布的高度                      |
| nodeTemplate                | 节点的模板                      |
| linkTemplate.defs(def)      | 预定义图形，可作用于线上，例如在线上加入箭头等形状。 |
| linkTemplate.path(path)     | 定义连接连个节点之间的线的样式。           |
| linkTemplate.dragLink(line) | 定义鼠标拖拽生成的线的样式。             |



#### 事件

| 名称                                | 说明                               |
| --------------------------------- | -------------------------------- |
| onSelectNode(eln,node)            | 当节点被选中的时候触发。                     |
| onClearActiveElement()            | 清空元素的选中状态时触发。                    |
| onNodeContextMenuRender(nodeInfo) | 当节点上触发右键的时候触发该事件，通过return可以生成菜单。 |
| contextmenuClick(node,action)     | 当节点上右键菜单项点击时触发。                  |

#### 方法

| 名称                           | 说明            |
| ---------------------------- | ------------- |
| topoflow.setData(newData);   | 设置新的数据并立即刷新图形 |
| topoflow.selectNode(nodeID); | 选中节点          |
| topoflow.addLink(linkInfo);  | 新增线条          |
| topoflow.addNode(nodeInfo);  | 新增节点          |
| topoflow.getNodes();         | 获取节点数据信息      |
| topoflow.getLinks();         | 获取线条数据信息      |

