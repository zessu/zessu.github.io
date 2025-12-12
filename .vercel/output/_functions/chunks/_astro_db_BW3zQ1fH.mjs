import { createRemoteDatabaseClient, asDrizzleTable } from '@astrojs/db/runtime';
import '@astrojs/db/dist/runtime/virtual.js';

const db = await createRemoteDatabaseClient({
  dbType: "libsql",
  remoteUrl: "libsql://saving-stargirl-duckduckquaquack.aws-eu-west-1.turso.io",
  appToken: process.env.ASTRO_DB_APP_TOKEN ?? void 0
});
const Post = asDrizzleTable("Post", { "columns": { "id": { "type": "text", "schema": { "unique": false, "deprecated": false, "name": "id", "collection": "Post", "primaryKey": true } }, "likes": { "type": "number", "schema": { "unique": false, "deprecated": false, "name": "likes", "collection": "Post", "primaryKey": false, "optional": false, "default": 0 } }, "reads": { "type": "number", "schema": { "unique": false, "deprecated": false, "name": "reads", "collection": "Post", "primaryKey": false, "optional": false, "default": 0 } } }, "deprecated": false, "indexes": {} }, false);
asDrizzleTable("Comment", { "columns": { "id": { "type": "text", "schema": { "unique": false, "deprecated": false, "name": "id", "collection": "Comment", "primaryKey": true } }, "postId": { "type": "text", "schema": { "unique": false, "deprecated": false, "name": "postId", "collection": "Comment", "primaryKey": false, "optional": false } }, "post": { "type": "text", "schema": { "unique": false, "deprecated": true, "name": "post", "collection": "Comment", "primaryKey": false, "optional": false } }, "comment": { "type": "text", "schema": { "unique": false, "deprecated": false, "name": "comment", "collection": "Comment", "primaryKey": false, "optional": true } }, "datePosted": { "type": "date", "schema": { "optional": false, "unique": false, "deprecated": false, "name": "datePosted", "collection": "Comment", "default": { "__serializedSQL": true, "sql": "CURRENT_TIMESTAMP" } } } }, "foreignKeys": [{ "columns": ["postId"], "references": [{ "type": "text", "schema": { "unique": false, "deprecated": false, "name": "id", "collection": "Post", "primaryKey": true } }] }], "deprecated": false, "indexes": {} }, false);

export { Post as P, db as d };
