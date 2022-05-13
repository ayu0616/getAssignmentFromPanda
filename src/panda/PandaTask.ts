import NotionDatabase from "../notion/NotionDatabase";
import { PandaTaskType, PandaTaskData, ParsedPandaTaskData } from "./types";
import NotionPage from "../notion/NotionPage";

export default abstract class PandaTask {
	taskName: string;
	dueDate: Date;
	className: string;
	taskId: string;

	constructor({ taskName, dueDate, className, taskId }: PandaTaskType) {
		this.taskName = taskName;
		this.dueDate = this.fixDueDate(dueDate);
		this.className = className;
		this.taskId = taskId;
	}

	/**締切時刻が0時0分なら前日の23時59分に変更する */
	fixDueDate(date: Date) {
		if (date.getHours() === 0 && date.getMinutes() === 0) {
			date = new Date(date.getTime() - (1 * 60 * 1000));
		}
		return date;
	}

	static parseTaskData(taskData: PandaTaskData): ParsedPandaTaskData {
		const parsedData = {
			taskName: taskData.title,
			dueDate: new Date(taskData.dueTimeString),
			taskId: taskData.id,
		};
		return parsedData;
	}
	isExistNotion(notionDatabaseItems: NotionPage[]): boolean {
		const existTaskIds = notionDatabaseItems.map((item) => item.taskId);
		return existTaskIds.includes(this.taskId);
	}
	pushToNotion(notionDatabase: NotionDatabase): void {}
	abstract getTaskUrl(): string;

	/**締め切り時間を日本時間の文字列に変換する */
	dateToJPNString() {
		// 時間を標準時から9時間すすめる
		const newDate = new Date(this.dueDate.getTime() + (9 * 60 * 60 * 1000));
		return newDate.toISOString();
	}
}
