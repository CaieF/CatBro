/**
 * 将数据限制在最小值和最大值之间
 * @param Value 传入的数据
 * @param Min 最小值
 * @param Max 最大值
 * @returns 限制后的数据
 */
export const clamp = (Value: number, Min: number, Max: number) => {
    return Math.min(Math.max(Value, Min), Max);
}

/**
 * 弧度制转角度 
 */
export const rad2Angle = (rad: number)=> {
    return (rad / Math.PI) * 180;
}

/**
 * 保留小数点后的位数
 * @param num 值
 * @param digit 保留的位数
 */
export const toFixed = (num: number, digit = 3) => {
    const scale = 10 ** digit;
    return Math.round(num * scale) / scale;
}
