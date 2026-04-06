import { _decorator, Component, Label, Node, RichText, Sprite } from 'cc';
import { ActorEntityTypeEnum, PropTypeEnum, WeaponEntityTypeEnum } from '../../Common';
import { IActorConfig } from '../../Factory/ActorFactory';
import DataManager from '../../Global/DataManager';
import { IWeaponConfig } from '../../Factory/WeaponFactory';
import { PanelBase } from './PanelBase';
import { IPropConfig } from '../../Factory/PropFactory';
const { ccclass, property } = _decorator;

/** 道具信息面板 */
@ccclass('PanelPropInfo')
export class PanelPropInfo extends PanelBase {
    @property({ type: Label, tooltip: '道具名称' })
    private labelPropName: Label = null;

    @property({ type: RichText, tooltip: '道具描述' })
    private labelPropDesc: RichText = null;

    @property({ type: Sprite, tooltip: '道具头像' })
    private spritePropIcon: Sprite = null;

    /** 渲染 */
    public render(propType: PropTypeEnum, propConfig: IPropConfig) {
        this.labelPropDesc.string = "";
        this.labelPropName.string = propConfig.name; 

        

        for (const modifer of propConfig.modifers) {
            let color = '#00ff0a'
            if (modifer.value > 0) {
                color = '#00ff0a'
                this.labelPropDesc.string += '+'
            } else {
                color = '#ff0000'
            }
            this.labelPropDesc.string += `<color=${color}>${modifer.value}</color> ${modifer.description}\n`;
        }
                
        // this.labelPropDesc.string = `<color=#f3eab6>伤害</color>: ${weaponConfig.baseDamage}(+${weaponConfig.meleeAddDamage *100}%近 +${weaponConfig.rangedAddDamage *100}%远 +${weaponConfig.elementAddDamage *100}%元素)\n<color=#f3eab6>冷却</color>: ${weaponConfig.attackInterval}s\n<color=#f3eab6>范围</color>: ${weaponConfig.attackRange}\n
        
        this.spritePropIcon.spriteFrame = DataManager.Instance.textureMap.get(propType)[0];
    }
}


