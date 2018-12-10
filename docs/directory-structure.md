## Directory structure

```bash
.
|── components/
|   └── libs/ #(all 3rd party components)
|   └── app/ #(all own components in folders containing JS, SCSS, HTML)
|   |   └── _deferred/ #(modules that are loaded dynamically)
|   |   └── _svg/ #(folder for inline-svg files to use with placeholder)
|   |   |   └── <svg-name>/
|   |   |   |   └── <svg-name>.svg
|   |   └── <component-name>/
|   |   |   └── img/ #(background-images used by this component)
|   |   |   └── font/ #(webfonts used by this component)
|   |   |   └── <component-name>.js
|   |   |   └── test-<component-name>.js
|   |   |   └── <component-name>.scss
|   |   |   └── <component-name>.html
|   |   └── main.js #(main requirejs module)
|   └── <project-name>.js #(require config)
|   └── <project-name>.scss #(base file for SCSS)
|── img/ #(images rendered by CMS)
└── .bowerrc
└── .csslintrc
└── .editorconfig
└── .gitignore
└── .scsslintrc
└── README.md
└── apple-touch-icon.png
└── bower.json
└── clientConfig.json #(if you want to deploy to servers)
└── favicon.ico
└── gems.rb
└── gruntfile.js
└── hostConfig.json #(if you want to deploy to servers)
└── package.json
└── sandbox.html #(main template, you can add as many as you want)
└── windows-tile-icon.png
```

This is what it builds into:

```bash
build/
|── assets/
|   └── img/
|       └── inline-svg/
|       └── favicon.ico
|       └── windows-tile-icon.png
|       └── apple-touch-icon.png
|   └── css/
|   └── js/
|       └── _deferred/
|       └── libs/
|── img/
└── sandbox.html
```

### HTML Placeholders

Include your modules via placeholder into your main template files. This gives you great overview on your templates and makes it easy to git log your components.

Here is what you can do with them:

```html
<html>
  <head>Your sandbox.html</head>
  <body>
    <!-- insert app/component-name/component-name.html -->
    {app:{component-name}}

    <!-- insert app/component-name/alternate-file.html -->
    {app:{component-name:{alternate-file}}}

    <!-- insert app/_deferred/component-name/component-name.html -->
    {deferred:{component-name}}

    <!-- insert app/_deferred/component-name/alternate-file.html -->
    {deferred:{component-name:{alternate-file}}}
  <body>
<html>
```

### SVG Placeholders

Include your svg graphics via placeholder into your main template files.

```html
<html>
  <head>Your sandbox.html</head>
  <body>
    <!-- insert svg/file-name/file-name.svg -->
    {svg:{file-name}}

    <!-- insert svg/folder-name/alternate-file.svg -->
    {svg:{folder-name:{alternate-file}}}
  <body>
<html>
```
