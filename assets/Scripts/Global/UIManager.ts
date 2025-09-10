import { find, instantiate, Node, Prefab } from "cc";
import Singleton from "../Base/Singleton";
import { UIBase } from "../Base/UIBase";
import { UIPathEnum, UITypeEnum } from "../Enum";
import { ResourceManager } from "./ResourceManager";
import { Debug } from "../Util";

export class UIManager extends Singleton {

    private uiRoot: Node;
    private uiPrefabMap: Map<UITypeEnum, Prefab>;
    private panels: Map<UITypeEnum, Node>;

    public static get Instance() {
        return super.GetInstance<UIManager>();
    }

    public async init(): Promise<void> {
        this.uiRoot = find("UIRoot");
        this.uiPrefabMap = new Map();
        this.panels = new Map();

        this.panels.set(UITypeEnum.UILoading, find("UIRoot/UILoading"));
        await this.loadPanel();

        Debug.Log(`UIManager init success`, this.panels, this.uiPrefabMap);

    }

    private async loadPanel() {
        let list = []
        for (const type in UIPathEnum) {
            const p = ResourceManager.Instance.loadRes(UIPathEnum[type], Prefab).then((prefab) => {
                this.uiPrefabMap.set(type as UITypeEnum, prefab);
            })
            list.push(p);
        }

        await Promise.all(list);
    }

    // public async initPanel(name: UITypeEnum, ...args: any[]) {
    //     if (this.panels.has(name)) return;

    //     const prefab = this.uiPrefabMap.get(name);
    //     const panel = instantiate(prefab);
    //     this.panels.set(name, panel);
    //     panel.getComponent(UIBase).init(...args);
    // }

    public async openPanel(name: UITypeEnum, bringToTop: boolean = true, ...args: any[]) {
        if (this.uiRoot === null) {
            this.uiRoot = find("UIRoot");
        }

        if (this.panels.has(name)) {
            let panel = this.panels.get(name);
            panel.active = true;
            panel.getComponent(UIBase)?.open(...args);
            if (bringToTop) {
                const index = this.uiRoot.children.length - 1;
                panel.setSiblingIndex(index);
            }
            return;
        }

        const prefab = this.uiPrefabMap.get(name);
        const panel = instantiate(prefab);
        this.panels.set(name, panel);
        panel.getComponent(UIBase).open(...args);
        this.uiRoot.addChild(panel);
        if (bringToTop) {
            const index = this.uiRoot.children.length - 1;
            panel.setSiblingIndex(index);
        }
    }

    public closePanel(name: UITypeEnum, destory: boolean = false, ...args: any[]) {
        if (!this.panels.has(name)) return;

        let panel = this.panels.get(name);
        if (destory) {
            this.panels.delete(name);
            panel.destroy();
            return;
        }

        panel.getComponent(UIBase)?.close(...args);
        panel.active = false;
    }
}