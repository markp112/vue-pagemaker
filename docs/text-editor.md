# Text Editor

Build a component to allow the user to edit text.

It should support 

* Font selection
* bold / italic / underline
* colour
* alignment
* bullets
* numbering

Nice to have
* Spell check
* language 

Implementation

users types selects item selects function from tool bar
apply style / html element

To apply a font wrap element in a span with style property of font-family
  get the tag 

  Range returns the block of text that the selection is taking place in.
  the start of the block of text is post the last HTML Tag and the end is at the closing tag
  therefore to insert a new tag into a block of text
  1) locate the text