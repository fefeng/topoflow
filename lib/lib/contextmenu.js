'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Contextmenu = function () {
    function Contextmenu(config) {
        _classCallCheck(this, Contextmenu);

        this.config = config;
        this.currentNodeID = '';
        this.initContextmenu();
    }
    // 初始化右键菜单操作


    _createClass(Contextmenu, [{
        key: 'initContextmenu',
        value: function initContextmenu() {
            var rightMenuEln = document.createElement("div");
            rightMenuEln.classList = 'right-menu';

            this.rightMenuEln = rightMenuEln;
            this.initEvent();

            this.config.container.appendChild(rightMenuEln);
        }
    }, {
        key: 'initEvent',
        value: function initEvent() {
            var _this = this;

            this.rightMenuEln.addEventListener('mouseleave', function (e) {
                _this.hide();
            });

            this.rightMenuEln.addEventListener('click', function (e) {
                if (!!_this.config.onClick) {
                    var jsons = e.target.dataset.info;
                    _this.config.onClick(_this.currentNodeInfo, JSON.parse(jsons));
                    _this.hide();
                }
            });
        }

        // 隐藏右键菜单

    }, {
        key: 'hide',
        value: function hide() {
            this.rightMenuEln.style = 'display:none;';
        }

        // 在指定的位置显示菜单

    }, {
        key: 'show',
        value: function show(nodeInfo, position) {
            this.currentNodeInfo = nodeInfo;
            this.genContextMenuItem();
            this.rightMenuEln.style = 'display: inline; transform: translate(' + position.x + 'px,' + position.y + 'px);';
        }
    }, {
        key: 'genContextMenuItem',
        value: function genContextMenuItem() {
            if (!!this.config.render) {
                var items = this.config.render(this.currentNodeInfo);

                if (!!!items || items === null) {
                    return;
                }
                var menuHTML = items.map(function (v) {
                    return '<li data-info=' + JSON.stringify(v) + '>' + v.label + '</li>';
                });
                this.rightMenuEln.innerHTML = '<ul>' + menuHTML.join(' ') + '</ul>';
            } else {
                return null;
            }
        }
    }]);

    return Contextmenu;
}();

exports.default = Contextmenu;
//# sourceMappingURL=contextmenu.js.map