import PandaTask from "./PandaTask";

export default class PandaAssignment extends PandaTask {
	getTaskUrl(): string {
		return `https://panda.ecs.kyoto-u.ac.jp/direct/assignment/${this.taskId}`
	}
}
