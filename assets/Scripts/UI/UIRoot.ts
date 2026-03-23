import { _decorator, Component, InstanceMaterialType, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('UIRoot')
export class UIRoot extends Component {

    public static Instance: UIRoot = null;

    @property({ type: Node, tooltip: '角色选择面板' })
    private uiHeroSelect: Node = null;

    @property({ type: Node, tooltip: '加载面板' })
    private uiLoading: Node = null;


    protected onLoad(): void {
        UIRoot.Instance = this;
    }

}


