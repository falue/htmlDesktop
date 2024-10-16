# Office - Spreadsheets

## Prepare csv file
Make a spreadsheet in eg. Libre office or Excel.

Export as `.csv` with the default / the following settings:
> Field delimeter: `,`
> 
> String delimeter: `"`
> [ ] Save cell content as shown
> [ ] Save cell formulas instead of calculated values
> [x] Quote all text cells
> [ ] Fixed column width

Put `.csv` in `data/`.

## URL parameters
| Parameter                          | Meaning |
| ---------------------------------- | ------- |
| `scene` | onload, the script looks out for the `.csv` in `data/*scene*.csv` |



## Styling cells
Column width, row height and styling does not translate automatically from your Libre office / Excel document when exporting as `.csv`.

Here are some styling options and functions you *can* use.

Everything in `[` `]` brackets gets interpreted in a certain way. Each parameter is terminated by `;`.

| Example                            | Meaning |
| ---------------------------------- | ------- |
|`[red]`<br>`[red; blueBg]`<br>`[bold; center; red; blueBg]` | These are interpreted as classnames and added to the `input` element |
|`[color:#563451]`<br>`[color:#563451; overflow-x:hidden]`|This is added as css-properties to the `input` element|
|`[colspan:7]`| This enlarges the current cell by 7 cells to the right. Note that I do not care for overwriting the cells next to it, they get moved by that amount. You have to move the cells accordingly. You'll figure out what I mean. |
|`[forceType:'this text gets auto typed']` | This forces the user to type `this text gets auto typed` int that particular cell |
|`[red; color:#452312; colspan:4; forceType:'this is a test']` | Combine everything. |




