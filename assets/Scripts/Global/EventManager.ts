import Singleton from "../Base/Singleton";
import { EventEnum } from "../Enum";

interface IItem {
    cb: Function;
    ctx: unknown;
}

export default class EventManager extends Singleton {
    public static get Instance() {
        return super.GetInstance<EventManager>();
    }

    private map: Map<EventEnum, Array<IItem>> = new Map();

    /**
     * 注册事件监听
     */
    public on(event: EventEnum, cb: Function, ctx: unknown) {
        if (this.map.has(event)) {
            this.map.get(event)!.push({ cb, ctx });
        } else {
            this.map.set(event, [{ cb, ctx }]);
        }
    }

    /**
     * 取消事件监听
     */
    public off(event: EventEnum, cb: Function, ctx: unknown) {
        if (this.map.has(event)) {
            const index = this.map.get(event)!.findIndex((item) => item.cb === cb && item.ctx === ctx);
            index > -1 && this.map.get(event)!.splice(index, 1);
        }
    }

    /**
     * 触发事件
     */
    public emit(event: EventEnum, ...args: unknown[]) {
        if (this.map.has(event)) {
            this.map.get(event)!.forEach((item) => {
                item.cb.apply(item.ctx, args);
            });
        }
    }

    /**
     * 清空所有事件监听
     */
    public clear() {
        this.map.clear();
    }
}
    