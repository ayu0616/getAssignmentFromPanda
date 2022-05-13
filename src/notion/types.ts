export type NotionData = {};

export type NotionPageType = {
	object: string;
	id: string;
	url: string;
	properties: NotionPageProperties;
};

export type NotionPageProperties = {
	授業名: { select: { id?: string; name: string } };
	締切日時: { date: { start: string; time_zone?: string } };
	チェック?: { checkbox: boolean };
	URL?: { url: string };
	実行日?: { date: string };
	課題: { title: { text: { content: string } }[] };
	panda_id?: { rich_text: { type?: "text"; text: { content: string } }[] };
};
