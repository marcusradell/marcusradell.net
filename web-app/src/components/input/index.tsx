import { Subject, merge } from "rxjs";
import {
  tap,
  switchMap,
  startWith,
  scan,
  zip,
  map,
  take
} from "rxjs/operators";

type MachineState = "initial" | "editing";

type State = {
  machine: MachineState;
  data: string;
};

const initialState: State = {
  machine: "initial",
  data: ""
};

const initialEditReducer = (s: string) => (state: State) => ({
  ...state,
  machineState: "editing",
  data: s
});

const editingEditReducer = (s: string) => (state: State) => ({
  ...state,
  data: s
});

// // START RxJS cruft. I will abstract this away. This would not be normal usage code.
// const initialEditSubject = new Subject();
// // An updater is a partially applied reducer, where you only need to send in the state to get a new state back.
// const initialEditUpdater = initialEditSubject.pipe(
//   map(v => initialEditReducer(v))
// );

// const editingEditSubject = new Subject();
// const editingEditUpdater = editingEditSubject.pipe(
//   map(v => editingEditReducer(v))
// );
// // END RxJS cruft.

const reducers = {
  initial: {
    edit: initialEditReducer
  },
  editing: {
    edit: editingEditReducer
  }
};

// START RxJS cruft.
// Will be triggered each time the state changes (should fix distinctUntilChanged and only look for machineState changes).
const doTransitionSubject = new Subject();

// Start listen to all the state updaters in the machine's initial state.
// Then each time the machine state changes, we will switch to the machine's new state instead.
const currentTransitionsStream = doTransitionSubject.pipe(
  startWith(machine.initial.updaters),
  switchMap(stream => stream)
);

const stateStream = currentTransitionsStream
  .pipe(
    startWith(initialState),
    scan((state, updater) => updater(state)),
    tap(state => doTransitionSubject.next(machine[state.machineState].updaters))
  )
  // Log out each state change.
  .forEach(state => {
    document.getElementById("app").innerHTML = `
${`<strong>${JSON.stringify(state)}</strong>`}
`;
  })
  // Should not be reached. This is a live/hot stream.
  .then(() => console.log("completed"))
  .catch(error => console.error(error));

machine.initial.transitions.edit.stream.forEach(v =>
  console.log(`Intent to trigger initial.edit with <${v}>.`)
);

// END RxJS cruft.

// Calling different triggers. (Could've used RxJS zip, but getting sleepy and sloppy.)
let i = 1;

machine.initial.transitions.edit.trigger("H");
setTimeout(() => machine.editing.transitions.edit.trigger("E"), 500 * i++);
setTimeout(() => machine.editing.transitions.edit.trigger("L"), 500 * i++);
setTimeout(() => machine.editing.transitions.edit.trigger("L"), 500 * i++);
setTimeout(() => machine.editing.transitions.edit.trigger("O"), 500 * i++);
// Called edit on initial machineState, so the action/intent is only logged in the console, while state remains unaffected.
setTimeout(() => machine.initial.transitions.edit.trigger("?"), 500 * i++);
