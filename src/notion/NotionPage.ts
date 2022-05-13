import { NotionPageProperties } from "./types";

export default class NotionPage {
	title: string;
	dueDate: string;
	className: string;
	taskId: string;
	taskUrl: string;

	constructor(
		{ title, dueDate, className, taskId, taskUrl }: {
			title: string;
			dueDate: string;
			className: string;
			taskId: string;
			taskUrl: string;
		},
	) {
		this.title = title;
		this.dueDate = dueDate;
		this.className = className;
		this.taskId = taskId;
		this.taskUrl = taskUrl;
	}

	toJson(): NotionPageProperties {
		const propJson: NotionPageProperties = {
			授業名: { select: { name: this.className } },
			締切日時: { date: { start: this.dueDate, time_zone: "Asia/Tokyo" } },
			チェック: { checkbox: false },
			URL: { url: this.taskUrl },
			課題: { title: [{ text: { content: this.title } }] },
			panda_id: { rich_text: [{ text: { content: this.taskId } }] },
		};
		return propJson;
	}
	toJsonString(): string {
		return this.toJson().toString();
	}
}
