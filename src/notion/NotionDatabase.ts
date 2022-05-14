import { AVOID_CORS_URL } from "../helper/envs";
import PandaTask from "../panda/PandaTask";
import NotionClient from "./NotionClient";
import NotionPage from "./NotionPage";
import { NotionPageType, NotionUpdateProperties } from "./types";

export default class NotionDatabase extends NotionClient {
	databaseId: string;

	constructor(token: string, databaseId: string) {
		super(token);
		this.databaseId = databaseId;
	}

	async query(filter: object = {}): Promise<NotionPage[]> {
		const url = AVOID_CORS_URL + `https://api.notion.com/v1/databases/${this.databaseId}/query`;
		const options: RequestInit = { method: "POST", headers: this.createRequestHeader(), body: JSON.stringify(filter) };
		const notionData: { results: NotionPageType[] } = await fetch(url, options)
			.then((res) => res.json())
			.then((data) => data);
		const notionPages = notionData.results.map(
			(notionPageData) => {
				const notionProperties = notionPageData.properties;
				return new NotionPage(
					this.token,
					{
						pageId: notionPageData.id,
						title: notionProperties.課題.title[0] ? notionProperties.課題.title[0].text.content : "",
						dueDate: notionProperties.締切日時.date.start,
						className: notionProperties.授業名.select.name,
						taskId: notionProperties.panda_id?.rich_text[0] ? notionProperties.panda_id?.rich_text[0].text.content : "",
						taskUrl: notionProperties.URL?.url ?? "",
						isChecked: notionProperties.チェック?.checkbox ?? false,
					},
				);
			},
		);
		return notionPages;
	}

	pushPage(notionPage: NotionPage): void {
		const url = `${AVOID_CORS_URL}https://api.notion.com/v1/pages`;
		const properties = notionPage.toJson();
		const options: RequestInit = {
			method: "POST",
			headers: this.createRequestHeader(),
			body: JSON.stringify({ parent: { database_id: this.databaseId }, properties: properties }),
		};
		fetch(url, options).then(() => console.log(`"${notionPage.title}" をNotionに追加しました`));
	}

	pushTask(pandaTask: PandaTask): void {
		const notionNewPage = new NotionPage(
			this.token,
			{
				title: pandaTask.taskName,
				dueDate: pandaTask.dateToJPNString(),
				className: pandaTask.pandaClass.name,
				taskId: pandaTask.taskId,
				taskUrl: pandaTask.getTaskUrl(),
				isChecked: false,
			},
		);
		this.pushPage(notionNewPage);
	}
}
