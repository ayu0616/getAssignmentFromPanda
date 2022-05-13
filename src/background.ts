/**【メモ】
 * ページを移動するたびにプログラムが動作するのはだめなので、なにか対策を講じなければならない
 * 例えば最終実行時刻を記録しておいて、そこから10分経つまではキャンセルさせるなど
 */

import { NOTION_TOKEN, NOTION_DATABASE_ID } from "./helper/envs";
import Helper from "./helper/Helper";
import NotionDatabase from "./notion/NotionDatabase";
import PandaClass from "./panda/PandaClass";
import PandaTask from "./panda/PandaTask";

const main = async () => {
	// 一定時間経過していなかったら過度のリクエストを送らないよう実行を中止する
	if (!Helper.isIntervalEnded(5)) {
		throw new Error("前回実行からまだ5分経っていないため実行を中止します");
	}
	console.log("課題を取得中")
	const pandaClasses = await PandaClass.createClasses();
	const pandaTasks: PandaTask[] = [];
	for (let pandaClass of pandaClasses) {
		const tasks = await pandaClass.createPandaTasks();
		pandaTasks.push(...tasks);
	}
	const notionDatabase = new NotionDatabase(NOTION_TOKEN, NOTION_DATABASE_ID);
	const taskDatabaseItems = await notionDatabase.query();
	const notExistTasks = pandaTasks.filter(
		(task) => !task.isExistNotion(taskDatabaseItems),
	);
	// notExistTasks.forEach(async (task) => await notionDatabase.pushTask(task));
	console.log("課題の取得が終了しました")
};

const test = async () => {
	const notionDatabase = new NotionDatabase(NOTION_TOKEN, NOTION_DATABASE_ID);
	const taskDatabase = await notionDatabase.query();
	console.log(taskDatabase);
};

(async () => {
	main().catch((error)=>console.log(error));
	// await test();
})();
