

export class GetDocumentMetaResponse {
    
    public id: number;
    public filename: string;
	public filetype: string;

    constructor(id: number, filename: string, filetype: string) {
		this.id = id;
		this.filename = filename;
		this.filetype = filetype;
    }
}