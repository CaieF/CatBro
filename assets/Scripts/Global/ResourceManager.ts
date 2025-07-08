import { Asset, resources } from "cc";
import Singleton from "../Base/Singleton";

/**
 * 资源管理类
 * 负责管理游戏资源的加载
 */
export class ResourceManager extends Singleton {
    public static get Instance() {
        return super.GetInstance<ResourceManager>();
    }

    /**
     * 加载资源
     * @param path 资源路径
     * @param type 资源类型
     * @returns 资源对象
     */
    public loadRes<T extends Asset>(path: string, type: new (...args: any[]) => T) {
        return new Promise<T>((resolve, reject) => {
            resources.load(path, type, (err, res) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(res);
            });
        });
    }

    /**
     * 加载文件夹下的资源
     * @param path 资源路径
     * @param type 资源类型
     * @returns 资源对象数组
     */
    public loadDir<T extends Asset>(path: string, type: new (...args: any[]) => T) {
        return new Promise<T[]>((resolve, reject) => {
            resources.loadDir(path, type, (err, res) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(res);
            });
        });
    }
}