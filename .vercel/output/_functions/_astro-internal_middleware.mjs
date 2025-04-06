import 'es-module-lexer';
import './chunks/astro-designed-error-pages_5Ze7Py6X.mjs';
import 'kleur/colors';
import './chunks/astro/server_XkzkhHpx.mjs';
import 'clsx';
import 'cookie';
import { d as defineMiddleware, s as sequence } from './chunks/index_fRtLgeL3.mjs';
import { g as getActionContext } from './chunks/server_CEyUtdql.mjs';

const onRequest$1 = defineMiddleware(async (context, next) => {
  if (context.isPrerendered) return next();
  const { action, setActionResult, serializeActionResult } = getActionContext(context);
  if (action?.calledFrom === "form") {
    const actionResult = await action.handler();
    setActionResult(action.name, serializeActionResult(actionResult));
  }
  return next();
});

const onRequest = sequence(
	
	
	onRequest$1
);

export { onRequest };
