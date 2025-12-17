
---

title: "NextJS: A High level overview"
description: "The main parts of Next JS"
pubDate: "Dec 12 2025"

---

<br />

#### `🔵 Why NEXT JS`

**Nextjs** was originally built to solve one main problem with client rendered components. **SEO**. With client side framworks like react, code is rendered on the client. This involves fetching a bundle of JS and hydrating everything on the client. There is really no way for search engines to index our sites.

Indexing is important because it enables your page to show up on Google search. If you are selling Mahogany tables on your site, you want to have organic traffic to your site when someone searches for mahogany tables on google. As such you want google and other search engines to be able to parse and index the different pages with products on your site and for them to do this, the content has to be rendered on the server.

#### `🟡 Server vs Client Components`

Server components are components rendered on the server and client components are components rendered on the client. Why a differentiation? Well because some components still need client side interactivity. We usually render pages on the server that do not need any complex interactivity. Think header and footers. They mostly contain links to other pages. These are prime targets for server rendered content

A prime example of a good client component is an interactive search component that needs state or a chart that needs complex interactions. By default, components in next js are rendered on the server unless you mark them with the "use client" directive. Example below

```javascript
// app/page.js -> default page
// By default, this is a Server Component.

import { CommentForm } from './comment-form'; // Imports the Client Component
import { fetchStaticContent } from './database'; // A hypothetical BE data function

export default async function Page() {
  const staticText = await fetchStaticContent(); // Runs ON THE SERVER

  return (
    <div className="container">
      <h1>Static Post Title</h1>
      <p>{staticText}</p> {/* Static text rendered by the server */}
      <hr />
      {/* ⚠️ This is where the Client Component is placed (a boundary) */}
      <CommentForm />
    </div>
  );
}


```

<br />
The Comment form in this case is a client rendered component because it relies on client state. We denote is as a client component using the "use client.

<br />

```javascript
// app/comment-form.js
'use client'; // ⚠️ This runs ONLY on the browser

export function CommentForm() {
  const [isSubmitting, setIsSubmitting] = useState(false); // can only happen on the client

  return (
    <form>
      <textarea name="comment" required />
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Posting...' : 'Post Comment'}
      </button>
    </form>
  );
}
```

<br />

#### `🟢 The how`

So now that we have seen client and server components, it is clear why we might need both. Server components help with **SEO** and also help render content on the server that we can immediately view. We get static HTML fast. Client components use react and run on the client so we get all the benefits of react that we do not get with server rendered templating engines like *Razor Pages, PHP, HandleBar JS*. ie complex client-side state management, component re-usability and modelling, virtual DOM diffing, good DX, hot reloading in dev e.t.c

Traditionally, with react/angular and other client rendered frameworks, the browser fetches a bundle of JS when the client visits your domain which is then used to hydrate the DOM to see the components and pages. With server rendered pages, all pages are rendered directly on the server and their HTML returned except components marked with "use client".

Components marked with **"use client"** are expected to be rendered on the client, so next sends markers denoting what payloads the client needs to ask from the server. This might look like this.

```javascript
<div class="container">
  <h1>Static Post Title</h1>
  <p>Welcome to our blog!</p>
  <hr />
  <div data-rsc-id="123"></div>
</div>
```

<br />
The original component on the server before SSR 👇⬇⬇
<br />

```javascript
// app/page.js
import { CommentForm } from './comment-form'; // Imports the Client Component
import { fetchStaticContent } from './database'; // A hypothetical BE data function

export default async function Page() {
  const staticText = await fetchStaticContent(); // Runs ON THE SERVER

  return (
    <div className="container">
      <h1>Static Post Title</h1>
      <p>{staticText}</p> {/* Static text rendered by the server */}
      <hr />
      {/* ⚠️ This component is sent as RSC payload */}
      <CommentForm />
    </div>
  );
}
```

<br />
On the client, nextjs has a runtime, the client runtime, that parses the content displaying it until it encounters

```
<div data-rsc-id="123"></div>
```

Here, it knows it needs to load some code from the server. The id is the identifier of the prepared payload which next constructs when it renders the server component. This looks like this ⬇⬇👇

```json
[
  "$$",              // Type identifier for a component reference
  "app/comment-form.js", // 👈 This is the bundle path identifier
  null,              // Initial props (if any)
  {
    "children": "..." // Any Server Component children that were passed
  }
]
```

So in this case next knows to load the client code for the comment form, which it does using a fetch request. This is then rendered and hydrated using react. Now we understand how both server and client components are rendered.

#### `🟣 The RSC payload, Suspense, Serialization and CVE's`

The **RSC** payload is a binary format that next uses to send data to the client in the case of client components but also from the client to the server with the `server actions` feature. All communication back and forth is done using RSC payloads with a protocol called the **flight protocol** that defines serialization formas and standards for communication from client to server.

We have already looked at how client components are loaded. This is also how the suspense feature works and server actions. Lets explore these briefly. When next js asks you to implement Suspense boundary like

```javascript
<Suspense fallback={<div>Loading...</div>}>
 <CommentForm />
</Suspense>
```

or even using a `loading.js` file, it server-side renders the loading.js file or the loading div and displays it on the client showing immediate feedback to the user. It then sees the RSC payload with an id and requests for the CommentForm from the server, rendering it when fully downloaded. This is how suspense works.

The RSC payload is also used to send data to server actions. Server actions are functions stored in the server that we can call to do things. e.g update the number of likes when someone clicks a button or leave a comment on a post of form as shown below 👇

```javascript
'use server'; // 👈 Server Action directive, use to mark server functions

import { db } from '@/lib/db';

export async function createComment(formData) {
  const title = formData.get('title');
  const content = formData.get('content');
  
  // ⚠️ Runs securely on the server
  await db.comments.create({ data: { title, content } }); 
}

// app/comment-form.js
import { createComment } from '@/actions/create-comment';

export default function CommentForm() {
  // Pass the Server Action directly to the form's action prop
  return (
    <form action={createComment}>
      <input type="text" name="title" />
      <textarea name="content" />
      <button type="submit">Submit</button> // calls createComment from client on submission, passing data from client to server
    </form>
  );
}
```

In this case our RSC payload has to tell nextjs what function to call on the server and what to call it with. ie call the **createcomment** function and call it with ***formData***. This is all encoded by next an sent in the RSC payload, pointing to the exact function we need to call and arguments we need to pass. Next also sends request headers, cookies that might help identify the client. Again, the protocol that governs this communication between the client and the component i.e standards like the binary format, serialization and deserialization is called the flight protocol.

Anytime you take user input from the client and you want to use it on the server, you need to sanitize it well. A critical vulnerability recently exploited next js by giving it malicious input allowing remote code execution once next evaluated the user provided input. This is explained here <https://nextjs.org/blog/CVE-66478> . I also wrote a proof of concept I wrote here <https://github.com/zessu/CVE-2025-55182-Typescript/blob/master/poc.ts>

#### `🟠 Conclusion`

So hopefully you now have a better understanding of how server components and client components work and a better understanding of next js, where client and server components are rendered, how they are rendered and how communication happens between the client and the server.

Often times I hear people say next.js is just JS coming *full circle*, PHP style and I hope this article shows you the difference. Next can server side render content like PHP, .NET, [Handlebars.js](https://handlebarsjs.com/) and Django but it also lets us use react for our client components. We get the best of both worlds, server rendered content where we need it and a full JS framework with virtual DOM, state, components, signals e.t.c while still giving us other next js features like server actions, caching, [an amazing router](https://nextjs.org/docs/pages/building-your-application/routing), Image optimization components, Font Optimizations and unified developer experience e.t.c

#### References

[Next JS blog](https://nextjs.org) <br />
[CVE-2025-66478](https://github.com/msanft/CVE-2025-55182)
