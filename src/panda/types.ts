import PandaClass from "./PandaClass";

export type ParsedPandaTaskData = {
	taskName: string;
	dueDate: Date;
	taskId: string;
};

export type PandaTaskType = ParsedPandaTaskData & { pandaClass: PandaClass };

export type PandaTaskData = { title: string; dueTimeString: string; id: string };

export type ApiResJson = {
	entityPrefix: string;
	assignment_collection: PandaTaskData[];
};
