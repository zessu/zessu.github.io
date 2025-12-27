---
title: "Astro For HTML Purists"
description: "Astro For HTML Purists"
pubDate: "Dec 27 2025"
---

### `🔵 Common Issues With HTML at Scale`

##### `A pure HTML/JS implementation sucks for complex projects`

Does not scale well beyond trivial complexity.

##### `HTML does not have native components 😭`

No way to reuse shared logic that might be contained in Headers or Footers leading to a lot of code duplication.

##### `No way to define layouts without code duplication`

You want to have a header body footer layout in multiple pages, the solution is code duplication. You better not forget to change one of the navigation links in one of the pages if you want it to point to something else.

##### `🕸 No obvious routing mechanism`

This is an obvious benefit once you use a framework like Tanstack router but I will leave this in here.

##### `No built in state management 🫨`

state management becomes an issue real fast once you need some state in one page to affect output in another page. Try doing this without polluting the global namespace

##### `No performant way to do extensive DOM modifications`

You have a table with 1000 elements and want to do filter and add some elements to them DOM or remove them based on user input. Good luck selecting first children and last children and removing them or adding them and doing `classList.add` based on the existence of user input

```typescript
const renderTasks = (): void => {
  const container = document.getElementById("task-list");
  if (!container) return;

  container.innerHTML = "";
  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.textContent = task.text;

    const btn = document.createElement("button");
    btn.textContent = "Delete";
    btn.onclick = () => deleteTask(task.id);

    li.appendChild(btn);
    container.appendChild(li);
  });
};
```

<br />

##### `Lifecycle Management could be better`

Want reactive rendering based on changes in some global state? Well you have to use events and listen to those events. This get complex really fast especially when you have to recheck for authentication of re-render some pages. It's just too **imperative**

##### `Code tends to be too imperative 🤓`

Take a look at this code for a simple login form

```javascript
// native-complex-form.ts

const loginForm = document.getElementById('login-form') as HTMLFormElement;
const emailInp = document.getElementById('email') as HTMLInputElement;
const passInp = document.getElementById('pass') as HTMLInputElement;

// Error label elements
const emailErr = document.getElementById('email-error') as HTMLSpanElement;
const passErr = document.getElementById('pass-error') as HTMLSpanElement;
const generalErr = document.getElementById('general-error') as HTMLDivElement;

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  // 1. Manual Reset: Hide everything first
  emailErr.style.display = 'none';
  passErr.style.display = 'none';
  generalErr.style.display = 'none';
  emailInp.classList.remove('input-error');
  passInp.classList.remove('input-error');

  let hasError = false;

  // 2. Manual Validation Logic
  if (!emailInp.value.includes('@')) {
    emailErr.innerText = 'Invalid email format';
    emailErr.style.display = 'block';
    emailInp.classList.add('input-error');
    hasError = true;
  }

  if (passInp.value.length < 6) {
    passErr.innerText = 'Password too short';
    passErr.style.display = 'block';
    passInp.classList.add('input-error');
    hasError = true;
  }

  if (hasError) return;

  // 3. Loading State
  const btn = document.getElementById('submit-btn') as HTMLButtonElement;
  btn.disabled = true;
  btn.innerText = 'Authenticating...';

  try {
    // API Call...
  } catch (err) {
    generalErr.innerText = 'Server unreachable';
    generalErr.style.display = 'block';
  } finally {
    btn.disabled = false;
    btn.innerText = 'Login';
  }
});
```

<br />

Compare this with more declarative react code 👇👇👇

```javascript
// ReactComplexForm.tsx
import React, { useState } from 'react';

type FormErrors = {
  email?: string;
  password?: string;
  general?: string;
};

export const ComplexForm = () => {
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: FormErrors = {};

    // Logic is separate from UI manipulation
    if (!emailValue.includes('@')) newErrors.email = 'Invalid email';
    if (passValue.length < 6) newErrors.password = 'Too short';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({}); // Clear old errors
    setIsSubmitting(true);
    // ... API call logic
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input className={errors.email ? 'input-error' : ''} />
      {/* The UI simply reacts to the existence of the error string */}
      {errors.email && <span className="error">{errors.email}</span>} 💓

      <input className={errors.password ? 'input-error' : ''} />
      {errors.password && <span className="error">{errors.password}</span>}

      <button disabled={isSubmitting}>
        {isSubmitting ? 'Authenticating...' : 'Login'} 👏
      </button>

      {errors.general && <div className="alert">{errors.general}</div>}
    </form>
  );
};
```

<br />

##### `No native build pipelines`

If we import a file eg `tailwindcss` from a cdn, you ship all of it to the user. no pipeline for code modifications provided out of the box

### 🟨 What Astro Brings to the Table ✨

##### `Astro files are HTML file extensions 🐒`

If you have an index.html and index.css, you can just change index.html to index.astro and it will just work. `.astro` is `.html` with a few extra benefits 👇

```typescript
--- 👈
# we can store variables and fetch stuff in code between the --- marks. otherwise everything else is just pure HTML
# Also by default this just runs on the server and returns pure HTML

type Product = {
  id: number;
  name: string;
  price: number;
  description: string;
};

// Fetching data from an API or local Markdown files
const title = "My Shop";
const response = await fetch('https://api.example.com/products');
const products: Product[] = await response.json();
---👈

<html>
  <body>
    <h1>{title}💪</h1>
    <div class="product-grid">
      {products.map((product) => (
        <div class="card">
          <h2>{product.name}</h2>
          <p>{product.description}</p>
          <span>${product.price}</span>
        </div>
      ))}
    </div>
  </body>
</html>

<style>
  /* Scoped CSS: This only applies to this component! */
  .product-grid {
    display: grid;
    gap: 1rem;
  }
  .card {
    border: 1px solid #ccc;
    padding: 1rem;
  }
</style>
```

<br />

##### `Components are easy 👶🎉`

No complexity, no code duplication. want a header to import in different files. Check out _components/Header.astro_ below

```typescript
---
const homeTitle = "Home"
---
<header>
  <nav>
    <a href="/">{homeTitle}</a>
    <a href="/about">About</a>
    <a href="/contact">Contact</a>
  </nav>
</header>

<style>
  header {
    background: #f4f4f4;
    padding: 1rem;
  }
  a {
    margin-right: 1rem;
  }
</style>
```

<br />

And a simple import in any file

```typescript
---
import Header from '../components/Header.astro';
---
<html>
  <body>
    <Header />
    <h1>Home Page</h1>
    <p>This page uses a static header component.</p>
  </body>
</html>
```

<br />

##### `Tooling 🔨⚙️`

You get what you do not get with HTML out of the box. A Build pipeline. This means tree shaking, minification, obfuscation, vite by default. `bun run build` and deploy these static assets. Tooling also gives you a better dev experience with `Hot Module Reloading` and the ability use Typescript if you want and other node modules and community published packages that can be bundled with your code.

##### `A file router that lets you group related routes in simple folders letting you apply common logic together` 📁🗺️

Intuitively think about and organize related routes.

##### `Image and font optimizations with native components` 🖼️✨

Native ways to use fonts and image optimizations provided directly with the browser allowing you to get those higher _CLS_, _INP_ _FCP_ _LCP_ values 👉 <https://web.dev/articles/vitals>

##### `🧑‍🦽 Accessibility with component libraries`

Work directly with component libraries like shadcn, radix ui / headless ui.

##### `Localized by default` 🔒💼

```astro
---
// This 'user' is scoped ONLY to this file.
const user: string = "John Doe";
---
<nav>Logged in as: {user}</nav>
```

<br />

##### `Content collections` 📚📝

The contents of this blog are all markdown pages that live in a content folder that Astro parses and renders <https://github.com/zessu/zessu.github.io/tree/main/src/content/blog>

### 🟥 Where Astro Falls Short 🤔

Astro solves the problems with using pure HTML/JS at any non trivial scale. I hope I have convinced HTML purists that Astro is worth checking out. It is `HTML Solved`. It's not a new thing, it is just HTML with a way to do components, optimize commonly used elements like images and fonts, and a build pipeline that allows you to use libraries like typescript and build/bundle/transpile/tree-shake right before a deployment. **Server Side Rendered by default**

Astro is not a heavy framework that needs you to learn its intricacies. Astro does not solve the same problems frameworks like **react angular solid svelte** solve. It allows you to import these frameworks and [**ship interactive client islands**](https://docs.astro.build/en/concepts/islands/) ie Parts of your page that will have a `bundle.js` that will load react for example from your server and use it for the stuff these frameworks solve like

1. **Complex global state management** e.g zustand 🐻, react context
2. **Lifecycle management** - useEffect, useLayoutEffect
3. **Efficient dom rendering through a virtual DOM 📁**
4. **Compiler optimizations**

<br />

#### `References`

<https://justfuckingusehtml.com/> <br />
<https://justfuckingusereact.com/> <br />
<https://justfuckinguseastro.com/>
