export type SitePageType = { sitePages: { title: string; url: string }[] };

export class SitePages implements SitePageType {
	sitePages: { title: string; url: string }[];

	constructor(sitePages: { title: string; url: string }[]) {
		this.sitePages = sitePages;
	}

	getAssignmentPageUrl() {
		return this.sitePages.find((sitePage) => sitePage.title === "課題")?.url;
	}
	getTestQuizPageUrl() {
		return this.sitePages.find((sitePage) => sitePage.title === "テスト・クイズ")?.url;
	}
}
