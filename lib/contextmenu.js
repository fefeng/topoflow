export default class Contextmenu {
    constructor(config) {
        this.config = config;
        this.currentNodeID = '';
        this.initContextmenu();
    }
    // 初始化右键菜单操作
    initContextmenu() {
        let rightMenuEln = document.createElement("div");
        rightMenuEln.classList = 'right-menu';

        this.rightMenuEln = rightMenuEln;
        this.initEvent();

        this.config.container.appendChild(rightMenuEln);
    }

    initEvent() {
        this.rightMenuEln.addEventListener('mouseleave', (e) => {
            this.hide();
        });

        this.rightMenuEln.addEventListener('click', (e) => {
            if (!!this.config.onClick) {
                let jsons = e.target.dataset.info;
                this.config.onClick(this.currentNodeInfo, JSON.parse(jsons));
                this.hide();
            }
        });
    }

    // 隐藏右键菜单
    hide() {
        this.rightMenuEln.style = 'display:none;';
    }

    // 在指定的位置显示菜单
    show(nodeInfo, position) {
        this.currentNodeInfo = nodeInfo;
        this.genContextMenuItem();
        this.rightMenuEln.style = `display: inline; transform: translate(${position.x}px,${position.y}px);`;
    }

    genContextMenuItem() {
        if (!!this.config.render) {
            let items = this.config.render(this.currentNodeInfo);
            if (items === null) {
                return;
            }
            let menuHTML = items.map(v => {
                return `<li data-info=${JSON.stringify(v)}>${v.label}</li>`
            });
            this.rightMenuEln.innerHTML = `<ul>${menuHTML.join(' ')}</ul>`;
        } else {
            return null;
        }
    }
}