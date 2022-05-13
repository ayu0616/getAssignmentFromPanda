import PandaTask from "./PandaTask";

export default class PandaAssignment extends PandaTask {
	getTaskUrl(): string {
		return "https://panda.ecs.kyoto-u.ac.jp/portal/tool/" +
		this.taskId +
		"?panel=Main";
	}
}
