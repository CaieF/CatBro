export class Debug {
    public static isDebug = true;
    public static isLog = true;
    public static isWarn = true;
    public static isError = true;

    /**
     * 打印日志
     */
    public static Log(tag: string, ...msg: unknown[]): void {
        if (!this.isDebug || !this.isLog) return;
        console.log(`${tag} --> `, ...msg);
    }

    /**
     * 打印警告信息
     */
    public static Warn(tag: string, ...msg: unknown[]): void {
        if (!this.isDebug || !this.isWarn) return;
        console.warn(`${tag} --> `, ...msg);
    }

    /**
     * 打印错误信息
     */
    public static Error(tag: string, ...msg: unknown[]): void {
        if (!this.isDebug || !this.isError) return;
        console.error(`${tag} --> `, ...msg);
    }
}