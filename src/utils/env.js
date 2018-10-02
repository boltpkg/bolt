// @flow
import ciParallelVars from 'ci-parallel-vars';

const VARS = {
  CI_NODE_TOTAL: ciParallelVars ? ciParallelVars.total : null,
  CI_NODE_INDEX: ciParallelVars ? ciParallelVars.index : null
};

const OVERRIDES = new Map();

export function get(name: $Keys<typeof VARS>) {
  return OVERRIDES.has(name) ? OVERRIDES.get(name) : VARS[name];
}

export function __override<Name: $Keys<typeof VARS>>(name: Name, value: any) {
  OVERRIDES.set(name, value);
}

export function __reset() {
  OVERRIDES.clear();
}
