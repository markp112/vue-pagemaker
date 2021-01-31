# Singletons

the application uses the following singletons:

* Colour
* Border
* Fonts
* SiteDefaults
* ComponentCounter
* Text-Attributes

## Colour
Holds the current selected colour when using the colour palette tool

## border
holds the border properties when editing borders

## Fonts
holds the font properties when editing text

## SiteDefaults
holds the defaults for the current site including colours fonts site and user id

## Component Counter
maintains a count of the number of components on a page each time a component is added the counter is incremented this ensures each component gets a unique reference. The counter is never decremented but can be reset based when moving to a new page.

## Text-Attributes
maintains the current text properties such as italic bold when editing text
