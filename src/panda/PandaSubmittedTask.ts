import NotionPage from "../notion/NotionPage";
import PandaTask from "./PandaTask";

export default class PandaSubmittedTask extends PandaTask {
	pandaTask: PandaTask;
	notionPage: NotionPage;

	constructor(pandaTask: PandaTask, notionPage: NotionPage) {
		if (pandaTask.taskId !== notionPage.taskId) {
			throw Error("pandaTaskとnotionPageが同一のタスクを表していません");
		}
		super({
			taskName: pandaTask.taskName,
			dueDate: pandaTask.dueDate,
			pandaClass: pandaTask.pandaClass,
			taskId: pandaTask.taskId,
		});
		this.pandaTask = pandaTask;
		this.notionPage = notionPage;
	}

	getTaskUrl(): string {
		return this.pandaTask.getTaskUrl();
	}

	toggleTrue() {
		this.notionPage.update({ チェック: { checkbox: true } });
	}

	isSubmitted(): boolean {
		return true;
	}
}
