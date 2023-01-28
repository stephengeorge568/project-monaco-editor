/**
 * Object containing static global values.
 */
export class GlobalConstants {
    // My workstation's local ip
    public static devServerAddress: string = "http://192.168.0.88:8080";
    //public static devServerAddress: string = "https://stepheng.dev:8443";
    // prod ip
    public static publicServerAddress: string = "https://stepheng.dev:8443";
    public static disableStompLogging = () => {};
}