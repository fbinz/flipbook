import {useEffect} from "react";

export async function useAsyncEffect(cb, deps) {
  return useEffect(() => {
    async function effect() {
      await cb();
    }

    effect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, cb]);
}