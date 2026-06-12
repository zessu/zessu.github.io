---
title: "Composition Over Inheritance"
description: "Composition Over Inheritance"
pubDate: "June 12 2026"
---

#### **What's Inheritance** 📝

Inheritance is an OOP concept that allows code reuse by collocating related behaviors in parent classes. The term inheritance borrows from the same term in biology which means to borrow traits from an ancestor. Here is a simple example showcasing inheritance

```typescript
class Primate {}

class Human extends Primate {}

class Monkey extends Primate {}
```

<br />

Humans and Monkeys are primates. This is what inheritance is all about. And it helps us model objects in OOP.

---

#### **The Problem** ⚠️

The problem with inheritance is - behavior that's baked into the parent class assumes the child classes will have that behavior. If this changes, it often means rethinking our model and refactoring code. When we start writing code, we often do not know how requirements will change over time. This creates brittle code that often needs to be changed. Composition presents a way of getting about this, but first lets see how code evolution might present a problem when using inheritance.

We will use the example of Primates. The goal is to demonstrate the problem and a solution and you should be able to take the learnings here and apply it to whatever domain you encounter. Now lets assume we are working with primates. In our mind, we can only think of monkeys for now so we write code like this

```typescript
class Primate {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  showTail() {
    console.log("Here is my tail");
  }
}

const ceasar = new Primate("ceaser");
ceasar.showTail(); // Here is my tail ✅
```

<br />

This continues working for us. At some point, we want to add a function to swing using our tail. So we do this.

```typescript
class Primate {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  showTail() {
    console.log("Here is my tail");
  }

  hang() {
    console.log("I am hanging from the tree using my tail");
  }
}
```

<br />

Now we reach a point where we want to add baboons. We realize that we have some functionality in our Primate class that doesn't quite belong to baboons. ie they cannot hang from branches by their tail. So we need a refactor. We refactor our code to introduce new classes for Monkey and Baboon that inherit from the Primate class.

```typescript
class Primate {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  showTail() {
    console.log("Here is my tail");
  }
}

class Monkey extends Primate {
  hang() {
    console.log("I am hanging from the tree using my tail");
  }
}

class Baboon extends Primate {}

const ceasar = new Monkey("ceaser");

ceasar.showTail(); // Here is my tail ✅

ceasar.hang(); // I am hanging from the tree using my tail ✅

const julius = new Baboon("julius");

julius.showTail(); // Here is my tail ✅
```

<br />

This works fine until we need to include humans. Humans are primates - but we do not have tails. Because monkeys and baboons do, we need to move this functionality to another class. Let's call it TaillessPrimates and TailfulPrimates. We need to change and refactor our code now to something like this

```typescript
class Primate {
  name: string;

  constructor(name: string) {
    this.name = name;
  }
}

class TaillessPrimates extends Primate {}

class TailfulPrimates extends Primate {
  showTail() {
    console.log("Here is my tail");
  }
}

class Monkey extends TailfulPrimates {
  hang() {
    console.log("I am hanging from the tree using my tail");
  }
}

class Baboon extends TailfulPrimates {}

class Human extends TaillessPrimates {}

const ceasar = new Monkey("ceaser");

ceasar.showTail(); // Here is my tail ✅

ceasar.hang(); // I am hanging from the tree using my tail ✅

const julius = new Baboon("julius");

julius.showTail(); // Here is my tail ✅

const andy = new Human("andy");
```

<br />

Now you can see we have built categories based on whether or not our primates have a tail. I am willing to bet that over time as we work on this code we will realize this is not smart. e.g What if we decided that every primate should be able to hang. Tail, hand whatever.

With inheritance, when the structures change, we often need to rethink how we defined our code and refactor. Yes, we can always change our code, but it's fickle especially in large codebases. A changing relationship can mean changing a lot of code. We cannot assume that the basis for an inheritance grouping won't change over time.

If this codebase was large enough, with long deep inheritance trees, this would be a nightmare. **The lesson:** every time you bake behavior into a parent class, you're betting that _all future children_ will need it. When that bet is wrong, the whole hierarchy fights you.

---

#### **Composition** 🧩

Composition aims to solve this by making the traits more _composable_ and _reusable_. Instead of inheriting behavior, you build it up. You compose it. In composition we won't define behaviors inside of parents. Let's see how we will define them. We start simple, we want a primate

```typescript
class Primate {
  name: string;

  constructor(name: string) {
    this.name = name;
  }
}
```

<br />

A primate has a name. Cool. Then we decide we want to have monkeys. Monkeys are primates. We create a class for them.

```typescript
class Monkey extends Primate {} // Monkey has a name 🐒
```

<br />

We want the monkey to be able to show us their tail

```typescript
class Monkey extends Primate {
  showTail() {
    console.log("look at my tail");
  }
}
```

<br />

Then we decide we want to have baboons.

```typescript
class Baboon extends Primate {}
```

<br />

Baboon and Monkey have a common behavior. They both can show us their tails. So we make both of them implement an interface

```typescript
interface ITailBragger {
  showTail: () => void;
}

class Monkey extends Primate implements ITailBragger {
  showTail() {
    console.log("look at my monkey tail");
  }
}

class Baboon extends Primate implements ITailBragger {
  showTail() {
    console.log("look at my baboon tail");
  }
}
```

<br />

We then want monkeys to hang by their tails. We can add this functionality in the monkey class.

```typescript
class Monkey extends Primate implements ITailBragger {
  showTail() {
    console.log("look at my monkey tail");
  }
  hang() {
    console.log("I am hanging by the tail woohoo");
  }
}
```

<br />

If we decide to add another type of Primate ie human, we can do this

```typescript
class Human extends Primate {}
```

<br />

If we decide we want Humans and Monkeys to all hang, we just extract that into an interface and compose those classes to implement the new interface

```typescript
interface IHanger {
  hang: () => void;
}

class Monkey extends Primate implements ITailBragger, IHanger {
  showTail() {
    console.log("look at my monkey tail");
  }
  hang() {
    console.log("I am hanging by the tail woohoo");
  }
}

class Human extends Primate implements IHanger {
  hang() {
    console.log("Look at me hanging by the hands");
  }
}
```

<br />

Notice how much easier this is to modify. We do not have to buy into inheritance trees and pay the cost of making wrong assumptions. This is easily extensible and allows us to make minimal modifications when we decide to add common functionality. Here's the full picture

```typescript
class Primate {
  name: string;

  constructor(name: string) {
    this.name = name;
  }
}

interface ITailBragger {
  showTail: () => void;
}

interface IHanger {
  hang: () => void;
}

class Monkey extends Primate implements ITailBragger, IHanger {
  showTail() {
    console.log("look at my tail");
  }

  hang() {
    console.log("I am hanging by the tail");
  }
}

class Baboon extends Primate implements ITailBragger {
  showTail() {
    console.log("look at my tail");
  }
}

class Human extends Primate implements IHanger {
  hang() {
    console.log("cool human");
  }
}
```

<br />

Now we can do this

```typescript
function hang(animal: IHanger) {
  console.log(animal.hang());
}

const andrew = new Human("andrew");

hang(andrew); ✅
```

<br />

but this will not work

```typescript
function hang(animal: IHanger) {
  console.log(animal.hang());
}

const babs = new Baboon("babs");

hang(babs): ❌ // 'Baboon' is not assignable to parameter of type 'IHanger'.
```

<br />

---

#### **Summary** ❓

Inheritance forces you to predict the future. You lock behavior into a parent class and hope every child will need it. When requirements shift — and they always do — you're stuck reshuffling hierarchies. Composition flips this. You start with the bare minimum and add behavior only where it's needed, through interfaces. When something changes, you update the one class that cares, not the entire tree. The primate example is simple, but the pattern holds at any scale: prefer composing small, focused behaviors over inheriting from a parent that tries to be everything.
