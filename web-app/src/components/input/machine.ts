import { Subject, merge, Observable } from "rxjs";
import { map } from "rxjs/operators";

type Reducer<T, S> = (event: T) => (state: S) => S;

type MachineNode = {
  trigger: Trigger;
  stream: Observable<any>;
  updater: Observable<any>;
};

function machineNode(reducer): MachineNode {
  const subject = new Subject();

  function trigger(x) {
    subject.next(x);
  }

  const stream = subject.asObservable();
  const updater = subject.pipe(map(x => reducer(x)));

  return { trigger, stream, updater };
}

type Reducers = { [s: string]: Reducer<any, any> };

type machineReducers = {
  [s: string]: Reducers;
};

type Trigger = (x: any) => void;

type SubMachine = {
  [actions: string]: MachineNode;
};

type Machine = {
  [s: string]: SubMachine;
};

function subMachine(reducers: Reducers): SubMachine {
  const subMachine: SubMachine = Object.keys(reducers).reduce(
    (sm: SubMachine, k: string) => {
      sm[k] = machineNode(reducers[k]);
      return sm;
    },
    {} as SubMachine
  );
  return subMachine;
}

export function machine(machineReducers: machineReducers): Machine {
  const machine: Machine = Object.keys(machineReducers).reduce(
    (m: Machine, k: string) => {
      const reducers = machineReducers[k];
      m[k] = subMachine(reducers);
      return m;
    },
    {} as Machine
  );

  return machine;
}

// // With real utility functions, you should only need to set each transition's name as key and the reducer as value. Then we would map the machine into what we see here.
// const machine = {
//   initial: {
//     transitions: {
//       edit: {
//         trigger: v => initialEditSubject.next(v),
//         stream: initialEditSubject.asObservable(),
//         updater: initialEditUpdater
//       }
//     },

//     updaters: merge(initialEditUpdater)
//   },
//   editing: {
//     transitions: {
//       edit: {
//         trigger: v => editingEditSubject.next(v),
//         stream: editingEditSubject.asObservable(),
//         updater: editingEditUpdater
//       }
//     },
//     updaters: merge(editingEditUpdater)
//   }
// };
