/**【メモ】
 * ページを移動するたびにプログラムが動作するのはだめなので、なにか対策を講じなければならない
 * 例えば最終実行時刻を記録しておいて、そこから10分経つまではキャンセルさせるなど
 */

import { NOTION_TOKEN, NOTION_DATABASE_ID, LOCAL_STORAGE_ITEM_NAME } from "./helper/envs";
import Helper from "./helper/Helper";
import NotionDatabase from "./notion/NotionDatabase";
import PandaClass from "./panda/PandaClass";
import PandaTask from "./panda/PandaTask";

const main = async () => {
	// 一定時間経過していなかったら過度のリクエストを送らないよう実行を中止する
	if (!Helper.isIntervalEnded(5)) {
		throw new Error("前回実行からまだ5分経っていないため実行を中止します");
	}

	console.log("課題を取得中");

	// お気に入り登録している授業を取得
	const pandaClasses = await PandaClass.createClasses();
	// 授業から課題を取得
	const pandaTasks: PandaTask[] = [];
	for (let pandaClass of pandaClasses) {
		// 各授業ごとに課題を取得
		const tasks = await pandaClass.createPandaTasks();
		pandaTasks.push(...tasks);
	}
	// Notionのデータベースを取得
	const notionDatabase = new NotionDatabase(NOTION_TOKEN, NOTION_DATABASE_ID);
	const taskDatabaseItems = await notionDatabase.query();
	// Notionに転記していない課題を抽出
	const notExistTasks = pandaTasks.filter((task) => !task.isExistNotion(taskDatabaseItems));
	// Notionに転記
	notExistTasks.forEach((task) => notionDatabase.pushTask(task));

	// 提出済みの課題にチェックを付ける
	for (let item of taskDatabaseItems) {
		// PandAのIDがなかったらスルー
		if (!item.taskId) continue;
		if (await item.isSubmitted()) {
			item.setCheckBox(true);
		}
	}

	console.log("課題の取得が終了しました");

	// ローカルストレージに実行時間を記録する
	localStorage.setItem(LOCAL_STORAGE_ITEM_NAME, new Date().getTime().toString());
};

const test = async () => {
	const notionDatabase = new NotionDatabase(NOTION_TOKEN, NOTION_DATABASE_ID);
	const taskDatabase = await notionDatabase.query();
	console.log(taskDatabase);
};

(async () => {
	main().catch((error) => console.log(error));
	// await test();
})();
