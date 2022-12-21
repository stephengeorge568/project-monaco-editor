import { MonacoRange } from "./MonacoRange";
/**
 * String change request object.
 */
export class StringChangeRequest {
    
    public documentId: number;
    public timestamp: string;
    public text: string;
    public identity: number;
    public range: MonacoRange;
    public revID: number;
    public setID?: number;
    public password?: string;

    constructor(timestamp: string, 
                text: string, identity: number, 
                range: MonacoRange, 
                revID: number, 
                documentId: number, 
                setID?: number,
                password?: string) {
        this.timestamp = timestamp;
        this.text = text;
        this.identity = identity;
        this.range = range;
        this.revID = revID;
        this.setID = setID;
        this.documentId = documentId;
        this.password = password;
    }
}