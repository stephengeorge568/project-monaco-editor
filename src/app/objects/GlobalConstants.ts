export class GlobalConstants {
    // My workstation's local ip
    public static devServerAddress: string = "http://localhost:8080";
    //public static devServerAddress: string = "https://stepheng.dev:8443";
    // prod ip
    public static publicServerAddress: string = "https://stepheng.dev:8443";
    public static disableStompLogging = () => {};
}