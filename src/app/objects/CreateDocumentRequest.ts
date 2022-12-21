/**
 * Request object for create document.
 */
export class CreateDocumentRequest {
    
    public password_hash: string;
    public filename: string;
	public filetype: string;

    constructor(password_hash: string, filename: string, filetype: string) {
		this.password_hash = password_hash;
		this.filename = filename;
		this.filetype = filetype;
    }
}