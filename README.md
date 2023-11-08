# htmlDesktop

This is a tool for digital props, used for movies and television, to easily emulate different operating systems on different operating systems. This circumvents the need for the real system to be properly prepared and stripped of everything that is not wanted.

Available right now are "clones" of Windows 10, mac OS Big Sur and some Linux-like distro.

These clones are not very accurate; and the goal in the end is to differentiate them enough that no copyright problems occur when displayed on commercial productions.

This repo is just the boilerplate for everything special that needs to be done to tell a story.

Customizing needs to be done onto the workstations, the brwoser, etc, to be ready for production.

# How this works
## Workstations
Workstations are, as the name implies, different computer setups for different scenes and/or characters. They include styling (like the OS used, the desktop image, system Colors etc) and positions of open or minimized windows or programs.

See [here](workstations/README.md) for everything about setting up new workstations.

## States
Local saving and loading is possible by using the browsers localSorage. Based off the workstations, you can further adjust and set up different variations of any workstation. You load up a workstation, adjust to the scenes needs, save it. 

When filming, the actress or actor can fool around. After the take, you reload the last state to start anew.

These scenes are by design local to the machine that you're using, so changes saved like this are not shared across different computers. They can be exportet, shared and imported though.

## Develop
VSCode with addon "live server" is very slow. Use caddy (same as the container app), even videos work correctly.
if necessary, run once:
```
brew install caddy
```
For your development:
```
caddy file-server --browse --listen :2015
```
The page is now available here: <http://localhost:2015/>

***NOTE: No hot reloading unfortunately 😔***

Did not work:
`serve` (hot reload, part of npm. Used global without installing for project, some local file paths are not found. images for example, but videos or scripts worked somehow, sometimes? maybe a cache thing?)
`npm run dev` (could not get it to work when installed npm)
XAMPP.app (cannot run it where you have your files)
`python3 -m http.server --cgi 8080` (does not serve big files correctly (eg., video files could not be seeked))
`php -S localhost:8080` (does not serve big files correctly (eg., video files could not be seeked))

## Display locally & offline
To display this locally and without an internet connection, there is a [container app](https://github.com/aronsommer/electron-webview) in development for Windows, Mac and Linux (including raspberry pi's).

To use this app, you need to clone this repo and use your own version of it to have your own workstations loaded into the app.

## Make the brute force Hard reload open windows & metadata work

In order to make the brute force attack on the local cache work (click in the action menu on "Hard reload open windows & metadata"), we need to hard reload all source files.

cd into `tools/` and execute `bash collectPaths.sh`. This saves all the current .css, .js, .txt, .json, .fakeBash, .splash paths in a document called `collectedPAths.txt`, which is used to hard reload all meta data files from within javascript.
