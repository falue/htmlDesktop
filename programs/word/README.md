# word

You can edit and style words here.


## URL parameters
```
scene                   folder name in "/data/", looks for `data/${scene}/index.html` file to display..
file                    ..if file is not set. If its set, looks for `data/${scene}/${file}.html`
forcetype               if true, document is forcetyped, meaning the text to type is pre-determined by the file.
```

> NOTE: when forcetype is activated (also with the bolt in the menu), the full text is there. so no text is to be typed. click an element and delete stuff, than you can retype it.
> double click any text block to delete them.
> Be ready for special cahracter to be replaced, for eg 
> does only work with enclosing html elements, like `<div>`, `<h1>` or `<p>`.Stuff like that does not work:
```html
<br>text
```

## file
Write pure html in the files of `data/`.
if you want to hyperlink some documents together, use this:
```html
<a href="#" onclick="hyperlink('2.html?v=1')">fake-link 2.html</a>
```
This loads the new document `data/${scene}/2.html?v=1` in word which is super nice.
bnot sure if the URL params get correctly interpreted though.
