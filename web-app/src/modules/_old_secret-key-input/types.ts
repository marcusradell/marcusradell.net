export type State = "empty" | "hidden" | "visible";

export type Store = {
  state: State;
  data: string;
};

type Generate = (s: Store) => Store;
type Download = (s: Store, effect: () => void) => Store;

export type Chart = {
  empty: {
    generate: Generate;
  };
  hidden: {
    generate: Generate;
    download: Download;
    view: (s: Store) => Store;
  };
  visible: {
    generate: Generate;
    download: Download;
    hide: (s: Store) => Store;
  };
};
