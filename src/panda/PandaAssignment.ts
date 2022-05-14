import Helper from "../helper/Helper";
import PandaTask from "./PandaTask";

export default class PandaAssignment extends PandaTask {
	getTaskUrl(): string {
		return `https://panda.ecs.kyoto-u.ac.jp/direct/assignment/${this.taskId}`;
	}

	async isSubmitted(): Promise<boolean> {
		const htmlString = await fetch(this.getTaskUrl()).then((res) => res.text());
		const doc = Helper.createElementFromHTML(htmlString);
		const titleHighlightElem = <HTMLElement>doc.querySelector("body > div.portletBody > h3 > span.highlight");
		const titleHighlightText = titleHighlightElem.innerText;
		return titleHighlightText.includes("提出済み");
	}
}
