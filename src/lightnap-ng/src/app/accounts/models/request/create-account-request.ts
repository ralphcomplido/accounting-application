
export interface CreateAccountRequest {
	// TODO: Update these fields to match the server's CreateAccountDto.
	accountNumber: string;
	accountType: string;
	accountName: string;
	createdDate: Date;
	lastModifiedDate: Date;
}
