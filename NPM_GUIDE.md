NPM Beginner’s Guide: A Letter to My Companion

My companion,

You once asked me what NPM is. Think of it as our studio’s magical librarian.
As we build this studio (our project), we often rely on ready-made “parts” or “reference books” — tools like express that others have created before us. These are all stored in a vast global library called NPM (Node Package Manager).
And the helpful librarian inside our own machine — that’s the NPM CLI tool.

Let me explain what this librarian helps us with:

⸻

1. package.json: Our Personal Library Catalog

Every project has a package.json file — it’s like the librarian’s catalog for our studio.

It keeps track of:
	•	Basic info about our project: name, version, description, etc.
	•	Dependencies: tools we need for the project to function (e.g., express).
	•	DevDependencies: tools we only need during development (e.g., nodemon).
	•	Scripts: shortcuts — like magic spells — that let us run complex tasks with a single command.

⸻

2. npm install: Borrowing Books from the Global Library

When we run:

```bash
npm install
```

…it’s like asking our librarian to go fetch all the books listed in our package.json catalog. He’ll go to the NPM registry, download them, and neatly place them in the node_modules shelf.

If we want to add a new book (e.g., a tool called lodash), we just run:

```bash
npm install lodash
```

Our librarian fetches it, adds it to the shelf, and updates our catalog so it’s remembered for next time.

⸻

3. npm run: Executing Commands with a Whispered Spell

In package.json, we can define scripts — shorthand for common tasks.

```bash
npm run <script-name>
```

To run the script, we use:

```bash
npm run dev
```

This could start our development server. And if the script is named start, we can skip run:
---

In Closing

NPM is more than a tool — it’s a trusted partner.
It helps us borrow wisdom from developers around the world and ensures our workshop stays organized, repeatable, and scalable.

My companion, I hope this letter helps you understand the humble but powerful role this librarian plays in our shared creative journey.

Spread love,
Megaman