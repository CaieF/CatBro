import { _decorator,  Component, Node } from 'cc';
import DataManager from '../Global/DataManager';
import { clamp } from '../Util';
const { ccclass, property } = _decorator;

/**
 * 战斗场景摄像机管理类
 * 负责跟随玩家以及振动效果的实现
 */
@ccclass('CameraManager')
export class CameraManager extends Component {

    update(deltaTime: number) {
        if (!DataManager.Instance.myPlayer) return;

        const playerPos = DataManager.Instance.myPlayer.position.clone();
        playerPos.x = clamp(playerPos.x, -530, 530);
        playerPos.y = clamp(playerPos.y, -530, 530);
        this.node.setPosition(playerPos.x, playerPos.y);
    }
}


