import PandaAssignment from "./PandaAssignment";
import PandaTask from "./PandaTask";
import { ApiResJson, PandaTaskType } from "./types";

export default class PandaClass {
	name: string;
	id: string;

	constructor(name: string, id: string) {
		this.name = this.formatName(name);
		this.id = id;
	}

	/**授業名のフォーマットを整える */
	formatName = (name: string) => {
		const title = name.replace(/\[.*\]/, "");
		const schedule = name.match(/[月火水木金][１-５]/);
		let formattedName = schedule + title;

		// 以下学期ごとに特有のもの
		if (formattedName === "経済学部秋田ゼミ") {
			formattedName = "水３" + formattedName;
		}
		if (formattedName === "月２中国語IIＡ") {
			formattedName += "（文法）";
		}
		if (formattedName === "火４中国語IIＡ") {
			formattedName += "（会話）";
		}
		return formattedName;
	};

	getAssignmentUrl() {
		const baseUrl = "https://panda.ecs.kyoto-u.ac.jp/direct/assignment/site/";
		return baseUrl + this.id + ".json";
	}

	getTestQuizUrl() {
		const baseUrl = "https://panda.ecs.kyoto-u.ac.jp/direct/sam_pub/context/";
		return baseUrl + this.id + ".json";
	}

	/**文字列からHTML要素を作成 */
	static createElementFromHTML(htmlString: string) {
		const domParser = new DOMParser();
		const doc = domParser.parseFromString(htmlString, "text/html");
		return doc;
	}

	/**作成する */
	static async createClasses() {
		const documentHtml = await fetch(
			"https://panda.ecs.kyoto-u.ac.jp/portal/site",
		)
			.then((res) => res.text())
			.then((text) => text);
		const document = PandaClass.createElementFromHTML(documentHtml);
		const favoriteSiteElems = new Array(
			...document.querySelectorAll(
				"ul.favoriteSiteList > li > div.fav-title > a:not([title='Home'])",
			),
		);
		const pandaClasses: PandaClass[] = [];
		for (let favoriteSiteElem of favoriteSiteElems) {
			const title = favoriteSiteElem.getAttribute("title");
			// タイトルが設定されなかったらエラー
			if (!title) {
				throw new Error("タイトルが不適切です");
			}
			const classUrl = favoriteSiteElem.getAttribute("href");
			// タイトルが設定されなかったらエラー
			if (!classUrl) {
				throw new Error("サイトのURLが不適切です");
			}
			const classId = classUrl.split("/").slice(-1)[0];

			const pandaClass = new PandaClass(title, classId);
			pandaClasses.push(pandaClass);
		}
		return pandaClasses;
	}

	/**PandaTaskクラスを作成する */
	async createPandaTasks(): Promise<PandaTask[]> {
		const url = this.getAssignmentUrl();
		const apiResJson: ApiResJson = await fetch(url)
			.then((res) => res.json())
			.then((data) => data);
		const pandaTasks = apiResJson.assignment_collection.map(
			(assignmentData) => {
				const parsedData = PandaTask.parseTaskData(assignmentData);
				const pandaTaskData: PandaTaskType = Object.assign(
					parsedData,
					{ className: this.name },
				);
				return new PandaAssignment(pandaTaskData);
			},
		);
		return pandaTasks;
	}
}
