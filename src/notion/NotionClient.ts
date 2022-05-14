import NotionPage from "./NotionPage";

export default abstract class NotionClient {
	token: string;
	NOTION_VERSION: string = "2022-02-22";

	constructor(token: string) {
		this.token = token;
	}

	createRequestHeader() {
		return {
			"Content-type": "application/json",
			Authorization: "Bearer " + this.token,
			"Notion-Version": this.NOTION_VERSION,
		};
	}
}
