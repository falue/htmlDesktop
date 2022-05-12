# fakeBash

One or more commands on a line describe the actions of the script.
Every command is in `[..]` brackets, and must contain at least the function name and may contain additional comma-seperated parameters.

Comments are possible if the first char in a line is a `#`.

The first line without a `#` is treated as the bashProfile string, which can be plain text or html.

Every command can have a class, indicated with `:className`; eg `[autotype:greenBg, "this text is green"]`

After every line, a `[br]` command is inserted, except if the class of the command is `:nobr`

The `EXIT` command stops parsing the file at this location. Good for testing.

## All possible commands function names & options

- `[bashProfile]` - prints a the bashProfile, defined in the first line in this document
- `[autotype, "text", 500]` - prints `text` at once, after a delay of `500`ms
- `[autotype:green, "text"]` - prints `text` at once but green without a delay
- `[forceType, "text"]` - user input is forced to type `text`, next command starts when enter is pressed. If the `text` starts with `sudo`, a third parameter is allowed for how to deal with the credentials, see below params for `[credentials]`.
- `[credentials]` - prints password verification. If the password contains `s`, it `s`ucceeds and goes on; if it contains `f`, it `f`ails and commands on the same line with credentials are then ignored.
- `[credentials, true]` - prints password verification - always succeeds on first try
- `[credentials, false]` - prints password verification - always fails (three times)
- `[credentials, 2]` - prints password verification - suceeds on `2`nd try (1-3)
- `[br]` - prints an additional line break
- `[wait]` - waits for the user to press any key
- `[waitForEnter]` - waits for the user to press enter
- `[sleep, 1000]` - waits 1000ms
- `[clear]` - clears the screen
- `[goto, 4]` - jump to command index `4`; `0` for begin of script
- `[loader, "Loading: \[", "▓", "░", "\]", 30, 2000, 0, 100, "Progress: ", "%"]` - Shows a loading animation with the char `▓` max repeated `30` times; `2000`ms total duration; goes from `0` to `100`;  and looks like this:
```
Loading: [▓▓▓▓▓░░░░░░░░░░░░░░░░░░░░░░░░░░] Progress: 17%
```
- `[freeText]` - With freeText, you can type whatever. fakeBash tries to interpret the typed string. If the command start with the following, *default scripts* get executed: `ls`, `ls -l`, `ls -l -a`, `clear`, `top`, `cd ~`, `cd folderName`, `cd ..`. If the command starts with `sudo`, eg. `sudo ls`, password credentials are asked first, then `ls` gets executed.

**NOTE**: If you want to have `[` or `]` anywhere in text, use `\[` or `\]`

**NOTE**: User interaction is only available when `freeText`, `forceType`, `credentials` or `wait` is being used.

### forceType & *default scripts*

All the *default scripts* above can be used as well within `forceType`:
- `[forceType, "ls"]`
- `[forceType, "ls -l"]`
- `[forceType, "ls -l -a"]`
- `[forceType, "clear"]`
- `[forceType, "top"]`
- `[forceType, "cd ~"]`
- `[forceType, "cd folder"]`
- `[forceType, "cd .."]`
- `[forceType, "sudo ls -l -a", true]`
**NOTE**: if you use `sudo` in forcetype, there is no need for an additional `[credentials]` command, as `sudo` already triggers that.
Also, there is a *third* parameter for sudo in forceType: Same functionality as in the `[credentials]` command; true/false or no third parameter.


## Example

```
# ------- setup
# bashProfileName
<span class='green'>admin</span>@<span class='red'>localhost</span>:<span class='grey'>~</span> $ 
# -------
[bashProfile] [forceType, "reboot now"]
[autoType:grey, "Reboot sequence initiated.", 500]
[autoType:grey, "Commence graceful shutdown and reboot..", 1500]
[autoType:grey, "Rebooting now.. Thanks for having me!", 2500]
[sleep, 1000]
[bashProfile] [autoType, "Start again?", 0] [wait]
[clear] [goto:nobr, 0]
```

