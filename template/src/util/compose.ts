/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
const compose = (...funcs: any[]) =>
  funcs.reduce(
    (a, b) =>
      (...args: any) =>
        a(b(...args)),
    (arg: any) => {
      return arg;
    },
  );

export default compose;
