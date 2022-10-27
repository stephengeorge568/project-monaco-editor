export class Document {
    public id: number;
	public model: string;
	public filename: string;
	public password_hash: string | null;
	public filetype: string;

    constructor(id: number, model: string, filename: string, password_hash: string | null, filetype: string) {
		this.id = id;
		this.model = model;
		this.filename = filename;
		this.password_hash = password_hash;
		this.filetype = filetype;
    }
}