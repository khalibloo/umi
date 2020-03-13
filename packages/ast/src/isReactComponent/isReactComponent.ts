import { traverse } from '@umijs/utils';
import { parse } from '../utils/parse';

export function isReactComponent(code: string) {
  const ast = parse(code);
  let hasJSXElement = false;
  traverse.default(ast as any, {
    JSXElement() {
      hasJSXElement = true;
    },
  });
  return hasJSXElement;
}
