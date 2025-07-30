
export interface Account {
	// TODO: Update these fields to match the server's AccountDto.
	id: number;
	accountNumber: string;
	accountType: string;
	accountName: string;
	createdDate: Date;
	lastModifiedDate: Date;
}
