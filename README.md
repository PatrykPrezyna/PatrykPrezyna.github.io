# Patryk Prężyna · personal site

Live at [patrykprezyna.github.io](https://patrykprezyna.github.io).

## Where things are

| File | What it is | Edit it? |
| --- | --- | --- |
| `content.js` | All text, skills, projects, experience, publications | **Yes. This is the one to edit.** |
| `assets/` | Pictures, one folder per project | Add pictures here |
| `index.html` | Frame of the page, plus the title and description shown by Google and link previews | Only the title and description |
| `styles.css` | Colours, fonts, layout | Only for design changes |
| `site.js` | Builds the page from `content.js` | No |

## How to edit

1. Open `content.js` (on github.com: open the file and press the pencil icon).
2. Find the section. They are numbered at the top of the file: `1. PERSON AND CONTACT`, `2. HERO`, `3. STATS`, `4. ABOUT`, `5. SKILLS`, `6. PORTFOLIO`, `7. EXPERIENCE`, `8. PUBLICATIONS`, `9. CONTACT`.
3. Change the text between the quotes, or copy a block and change it.
4. Commit. The site updates in a minute or two.

Three rules: text goes between `"double quotes"`, every line in a list ends with a comma, and lines starting with `//` are notes that the site ignores.

If a comma or quote is missing, the page shows a red box that names the line in `content.js`. Fix that line, or the one before it.

## Common edits

### Add a skill

In section 5, add a line:

```js
    "Robotics",
```

The skill becomes a link by itself when a project has a badge with exactly the same name. If the names differ, name the project by its `id`:

```js
    { name: "Agile / Scrum", project: "machine" },
```

A skill with no matching project is a plain badge. Skills never link anywhere except to a project.

### Add a badge to a project

In section 6, find the project and add the name to its `badges` line:

```js
      badges: ["ISO 13485", "ISO 14971", "Fast Prototyping"],
```

To show it under Technical skills too, add the same name in section 5.

### Add a project

1. Put the pictures in a new folder, for example `assets/my-project/`.
2. In section 6, copy the template at the top of the section (or an existing project, from its `{` to its `},`) and paste it where the project should appear.
3. Fill it in:

```js
    {
      id: "my-project",
      tag: "Robotics",
      title: "Name of the project",
      featured: true,
      images: [
        {
          file: "assets/my-project/picture.png",
          caption: "Short text shown under the picture.",
          description: "What the picture shows, for screen readers.",
        },
      ],
      challenge: "One paragraph about the problem.",
      contribution: [
        "What I did.",
        "What came out of it.",
      ],
      badges: ["Python", "ROS"],
    },
```

What the lines do:

- `featured: true` gives a full-width row. `featured: false` gives a small tile in the grid below the rows.
- `open: true` makes the project open when the page loads. Use it on one project only.
- `draft: true` hides the project without deleting it.
- `images` can be left out. The first picture is the one shown first. Add `fill: true` to a photo that should fill the frame.
- `challenge` is one paragraph in quotes, or a list in `[ ]` for bullet points.
- `facts` adds big numbers above the challenge: `facts: [{ number: "15,000", label: "What it means" }],`
- The numbers 01, 02, 03 are set automatically.

### Remove a project

Delete its block, from its `{` to its `},`.

### Add a job, a role, or a publication

Sections 7 and 8 work the same way: copy a block and change it. In a role, `dates`, `text` and `points` are optional.

### Change the photo, e-mail, or LinkedIn

Section 1. To replace the photo, upload the new one to `assets/` and write its name in `photo`. Keep it under about 300 KB and 1400 pixels tall so the page loads fast.

## Preview on your computer

Open `index.html` in a browser. No install or build step is needed.
