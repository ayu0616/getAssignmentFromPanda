import { SitePages, SitePageType } from "./SitePages";

export default class PandaSite {
	title: string = "";
	siteUrl: string = "";
	assignmentPageUrl: string | undefined;
	testQuizPageUrl: string | undefined;

	constructor(title: string, siteUrl: string) {
		this.setTitle(title);
		this.siteUrl = siteUrl.replace("-reset", "");
	}

	/**授業名を設定する */
	setTitle(title: string) {
		// "[月３]マクロ経済学１"みたいな形式
		const checker = /[月火水木金][１-５].+/;
		// 授業名が適切なものかをチェックする
		if (title.match(checker)) {
			this.title = title;
		} else {
			throw new Error("授業名のフォーマットが間違っています\n正しいフォーマットの例：'[月３]マクロ経済学１'");
		}
	}

	/**文字列からHTML要素を作成 */
	static createElementFromHTML(htmlString: string) {
		const domParser = new DOMParser();
		const doc = domParser.parseFromString(htmlString, "text/html");
		return doc;
	}

	/**サイト内のページのURLを設定する */
	async setPageUrl() {
		const sitePageData = await fetch(
			this.siteUrl.replace("portal", "direct") + ".json",
		)
			.then((res) => res.json())
			.then((data: SitePageType) => data);
		const sitePages = new SitePages(sitePageData.sitePages);

		this.assignmentPageUrl = sitePages.getAssignmentPageUrl();
		this.testQuizPageUrl = sitePages.getTestQuizPageUrl();
		// 	const sitePageElem = PandaSite.createElementFromHTML(sitePageHtml);
		// 	// サイドメニューの要素リスト（「概要」とか「お知らせ」とかのやつ）
		// 	const toolElems = new Array(
		// 		...sitePageElem.querySelectorAll("#toolMenu > ul > li > a"),
		// 	);

		// 	const assignmentPageUrl = toolElems
		// 		.find(
		// 			(elem) => {
		// 				return elem.getAttribute("title")?.slice(0, 2) === "課題";
		// 			},
		// 		)
		// 		?.getAttribute("href");
		// 	const testQuizPageUrl = toolElems
		// 		.find((elem) => {
		// 			return elem.getAttribute("title")?.slice(0, 7) === "テスト・クイズ";
		// 		})
		// 		?.getAttribute("href");

		// 	if (assignmentPageUrl) {
		// 		this.assignmentPageUrl = assignmentPageUrl;
		// 	}
		// 	if (testQuizPageUrl) {
		// 		this.testQuizPageUrl = testQuizPageUrl;
		// 	}
	}

	/**作成する */
	static async getSites() {
		/**
         * 授業名の修正
         * 学期が変わったらここは編集しないといけない
         */

		const documentHtml = await fetch(
			"https://panda.ecs.kyoto-u.ac.jp/portal/site",
		)
			.then((res) => res.text())
			.then((text) => text);
		const document = PandaSite.createElementFromHTML(documentHtml);
		const formatTitle = (title: string) => {
			title = title.replace(/202[1-4][前後]期/, "");

			// 以下学期ごとに特有のもの
			if (title === "経済学部秋田ゼミ") {
				title = "[水３]" + title;
			}
			if (title === "[月２]中国語IIＡ") {
				title += "（文法）";
			}
			if (title === "[火４]中国語IIＡ") {
				title += "（会話）";
			}

			return title;
		};
		const favoriteSiteElems = new Array(
			...document.querySelectorAll(
				"ul.favoriteSiteList > li > div.fav-title > a:not([title='Home'])",
			),
		);
		const sites: PandaSite[] = [];
		for (let favoriteSiteElem of favoriteSiteElems) {
			const title = favoriteSiteElem.getAttribute("title");
			// タイトルが設定されなかったらエラー
			if (!title) {
				throw new Error("タイトルが不適切です");
			}
			// タイトルのフォーマットを整える
			const formattedTitle = formatTitle(title);

			const siteUrl = favoriteSiteElem.getAttribute("href");
			// タイトルが設定されなかったらエラー
			if (!siteUrl) {
				throw new Error("サイトのURLが不適切です");
			}

			const site = new PandaSite(formattedTitle, siteUrl);
			await site.setPageUrl();
			sites.push(site);
		}
		return sites;
	}
}
