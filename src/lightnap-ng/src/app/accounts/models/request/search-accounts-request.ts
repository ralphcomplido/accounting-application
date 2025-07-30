
import { PagedRequestDto } from "@core";
export interface SearchAccountsRequest extends PagedRequestDto {
	// TODO: Update these fields to match the server's SearchAccountDto.
	accountNumber?: string;
	accountType?: string;
	accountName?: string;
	createdDate?: Date;
	lastModifiedDate?: Date;
}
