import { LOCAL_STORAGE_ITEM_NAME } from "./envs";

export default class Helper {
	/**前回実行から一定時間経ったかどうか判定する関数
     * 何度もリクエストを送らないようにするためのもの
     */
	static isIntervalEnded(waitMinutes: number) {
		const lastExecutedTimeString = localStorage.getItem(LOCAL_STORAGE_ITEM_NAME) ?? "0";
		const lastExecutedTimeNum = Number(lastExecutedTimeString);
		const nowTime = new Date();
		// 一定時間経っていたらtrue、経っていなかったらfalseを返す
		const isEnded = ((nowTime.getTime() - lastExecutedTimeNum) / 1000 / 60) > waitMinutes;
		return isEnded;
	}

	/**文字列からHTML要素を作成 */
	static createElementFromHTML(htmlString: string) {
		const domParser = new DOMParser();
		const doc = domParser.parseFromString(htmlString, "text/html");
		return doc;
	}
}
