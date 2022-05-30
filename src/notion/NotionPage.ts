import { AVOID_CORS_URL } from "../helper/envs";
import Helper from "../helper/Helper";
import NotionClient from "./NotionClient";
import { NotionPageClassMembers, NotionPageProperties, NotionUpdateProperties } from "./types";

export default class NotionPage extends NotionClient implements NotionPageClassMembers {
	pageId?: string = "";
	title: string;
	dueDate: string;
	className: string;
	taskId: string;
	taskUrl: string;
	isChecked: boolean;

	constructor(token: string, { pageId, title, dueDate, className, taskId, taskUrl, isChecked }: NotionPageClassMembers) {
		super(token);
		this.pageId = pageId;
		this.title = title;
		this.dueDate = dueDate;
		this.className = className;
		this.taskId = taskId;
		this.taskUrl = taskUrl;
		this.isChecked = isChecked;
	}

	toJson(): NotionPageProperties {
		const propJson: NotionPageProperties = {
			授業名: { select: { name: this.className } },
			締切日時: { date: { start: this.dueDate, time_zone: "Asia/Tokyo" } },
			チェック: { checkbox: this.isChecked },
			URL: { url: this.taskUrl },
			課題: { title: [{ text: { content: this.title } }] },
			panda_id: { rich_text: [{ text: { content: this.taskId } }] },
		};
		return propJson;
	}
	toJsonString(): string {
		return this.toJson().toString();
	}

	async update(properties: NotionUpdateProperties) {
		const url = `${AVOID_CORS_URL}https://api.notion.com/v1/pages/${this.pageId}`;
		const options: RequestInit = {
			method: "PATCH",
			headers: this.createRequestHeader(),
			body: JSON.stringify({ properties: properties }),
		};
		return fetch(url, options);
	}

	setCheckBox(state: boolean) {
		this.update({
			チェック: {
				checkbox: state,
			},
		}).then(() => {
			console.log("Notionの課題'" + this.title + "'にチェックを付けました");
			this.isChecked = state;
		});
	}

	async isSubmitted() {
		if (this.isChecked) return true;
		const htmlString = await fetch(this.taskUrl).then((res) => res.text());
		const doc = Helper.createElementFromHTML(htmlString);
		const titleHighlightElem = <HTMLElement>doc.querySelector("body > div.portletBody > h3 > span.highlight");
		const titleHighlightText = titleHighlightElem.innerText;
		return titleHighlightText.includes("提出済み");
	}
}
