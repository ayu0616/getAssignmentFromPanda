export default class Helper {
	/**前回実行から一定時間経ったかどうか判定する関数
     * 何度もリクエストを送らないようにするためのもの
     */
	static isIntervalEnded(waitMinutes: number) {
		const localStorageItemName = "lastExecutedTime";
		const lastExecutedTimeString = localStorage.getItem(localStorageItemName) ?? "0";
		const lastExecutedTimeNum = Number(lastExecutedTimeString);
		const nowTime = new Date();
		// 一定時間経っていたらtrue、経っていなかったらfalseを返す
		const isEnded = (
			(nowTime.getTime() - lastExecutedTimeNum) / 1000 / 60
		) > waitMinutes;
		// 一定時間経過していれば、今回実行するのでその時刻を記録しておく
		if (isEnded) {
			localStorage.setItem(localStorageItemName, nowTime.getTime().toString());
		}
		return isEnded;
	}
}
