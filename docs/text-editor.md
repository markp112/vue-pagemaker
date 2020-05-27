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

  #Ranges
  Common Ancestor = Text
   endoffset = common ancestor length we have to the end of the range selected
   startOffset = 0 we have the start of range selected
   startOffset !=0 we have the offset from the start of the text

   Common Ancestor = P

    startContainer = text 
      if start offset = length of the first container then ouur selection does not include the first element
      start offset is the point in the text where our selection starts and next element Sibling tells us the type of the selected node
      if the start Offset is less than the lenght of the first container we are including elements of the first container in the selection.

