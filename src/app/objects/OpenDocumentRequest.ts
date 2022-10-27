

export class OpenDocumentRequest {
    
    public id: number;
    public password: string;


    constructor(id: number, password: string) {
		this.id = id;
		this.password = password;
    }
}