import { CreateAction } from "rx-machine";

export type EditingStore = {
  state: "editing";
  value: string;
};

export type Store = EditingStore;

export type Chart = {
  editing: ["edit"];
};

export type EditReducer = (s: Store, value: string) => EditingStore;

export type Actions = {
  edit: CreateAction<EditReducer>;
};
