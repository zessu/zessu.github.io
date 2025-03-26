import { g as getActionQueryString } from './astro-designed-error-pages_BbvzZTkX.mjs';
import 'es-module-lexer';
import 'kleur/colors';
import './astro/server_My-EQ2pT.mjs';
import 'clsx';
import 'cookie';
import { d as db, P as Post } from './_astro_db_Dj1Q2wxM.mjs';
import * as z from 'zod';
import { d as defineAction } from './server_BgjT87h3.mjs';
import { eq } from '@astrojs/db/dist/runtime/virtual.js';

const ENCODED_DOT = "%2E";
function toActionProxy(actionCallback = {}, aggregatedPath = "") {
  return new Proxy(actionCallback, {
    get(target, objKey) {
      if (objKey in target || typeof objKey === "symbol") {
        return target[objKey];
      }
      const path = aggregatedPath + encodeURIComponent(objKey.toString()).replaceAll(".", ENCODED_DOT);
      function action(param) {
        return handleAction(param, path, this);
      }
      Object.assign(action, {
        queryString: getActionQueryString(path),
        toString: () => action.queryString,
        // Progressive enhancement info for React.
        $$FORM_ACTION: function() {
          const searchParams = new URLSearchParams(action.toString());
          return {
            method: "POST",
            // `name` creates a hidden input.
            // It's unused by Astro, but we can't turn this off.
            // At least use a name that won't conflict with a user's formData.
            name: "_astroAction",
            action: "?" + searchParams.toString()
          };
        },
        // Note: `orThrow` does not have progressive enhancement info.
        // If you want to throw exceptions,
        //  you must handle those exceptions with client JS.
        async orThrow(param) {
          const { data, error } = await handleAction(param, path, this);
          if (error) throw error;
          return data;
        }
      });
      return toActionProxy(action, path + ".");
    }
  });
}
async function handleAction(param, path, context) {
  {
    const { getAction } = await import('./server_BgjT87h3.mjs').then(n => n.a);
    const action = await getAction(path);
    if (!action) throw new Error(`Action not found: ${path}`);
    return action.bind(context)(param);
  }
}
toActionProxy();

const server = {
  likePost: defineAction({
    input: z.object({
      hash: z.string()
    }),
    handler: async (input) => {
      try {
        const { hash } = input;
        const existingPost = await db.select().from(Post).where(eq(Post.id, hash));
        if (existingPost.length === 0)
          throw new Error("could not find post with that identifier");
        await db.update(Post).set({ likes: existingPost[0].likes + 1 }).where(eq(Post.id, hash)).execute();
        return { message: "success" };
      } catch (error) {
        console.log(error);
      }
    }
  }),
  updatePostVisits: defineAction({
    input: z.object({
      hash: z.string()
    }),
    handler: async (input) => {
      try {
        const { hash } = input;
        const postReads = await db.select().from(Post).where(eq(Post.id, hash));
        if (postReads.length === 0)
          throw new Error(`theres a problem with post: ${hash}`);
        await db.update(Post).set({ reads: postReads[0].reads + 1 }).where(eq(Post.id, hash)).execute();
        return { message: "success" };
      } catch (error) {
        console.log(error);
      }
    }
  })
};

export { server };
