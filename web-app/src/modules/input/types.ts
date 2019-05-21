export type Store = {
  state: "editing";
  ctx: string;
};

export type Chart = {
  editing: {
    edit: (s: Store, ctx: string) => Store;
  };
};
