import Flow from './topoflow';
import common from './lib/common';
// 封装外暴露的方法
class Index {
    constructor(config) {
        let obj = {};
        Object.assign(obj, config);

        this.config = obj;

        obj.onDataChange = this.onDataChange.bind(this);

        this.flow = new Flow(obj);
        this.flow.init();
        this.drawFlow(this.config.data);
    }

    // 设置数据
    setData(data) {
        this.config.data = data;
        this.drawFlow(data);
    }

    // 渲染图形
    drawFlow() {
        let nodes = [];
        let links = [];
        this.flow.reset();
        
        try {
            nodes = this.config.data.nodes;
            links = this.config.data.links;
        } catch (e) {
            return false;
        }

        if (!!nodes && nodes.length > 0) {
            nodes.forEach((node) => {
                this.flow.addNode(node);
                if (node.selected) {
                    this.selectNode(node.id);
                }
            });
        }

        // 渲染链接
        if (!!links && links.length > 0) {
            links.forEach((link) => {
                this.flow.addLink(this.flow.Nodes[link.from], this.flow.Nodes[link.to]);
            });
        }
    }

    // 选中一个节点
    selectNode(nodeID) {
        this.flow.selectNode(nodeID);
    }

    // 新增节点
    addNode(nodeInfo) {
        return this.flow.addNode(nodeInfo);
    }

    // 新增线条
    addLink(sourceNode, targetNode) {
        this.flow.addLink(sourceNode, targetNode);
    }

    getNodes() {
        let nodes = this.flow.Nodes;
        let nodesID = Object.keys(nodes);
        return nodesID.map((id) => {
            nodes[id].x = Math.floor(nodes[id].x);
            nodes[id].y = Math.floor(nodes[id].y);
            return nodes[id];
        });
    }

    onDataChange() {
        let nodes = this.getNodes();
        let links = this.getLinks();

        if (!!this.config.onChange) {
            this.config.onChange({
                nodes,
                links
            });
        }
    }

    getLinks() {
        let links = this.flow.Links;
        let linksID = Object.keys(links);
        return linksID.map((id) => {
            return links[id];
        });
    }

    genUUID() {
        return common.genUUID();
    }
}
export default Index;
