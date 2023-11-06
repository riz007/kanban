export type TID = string;

export interface IColumn {
  id: TID;
  title: string;
  tasks: ITask[];
}
export interface ITask {
  id: TID;
  title: string;
  createdAt: Date;
}
