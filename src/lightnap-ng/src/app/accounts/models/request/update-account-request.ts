
export interface UpdateAccountRequest {
	// TODO: Update these fields to match the server's UpdateAccountDto.
	accountNumber: string;
	accountType: string;
	accountName: string;
	createdDate: Date;
	lastModifiedDate: Date;
}