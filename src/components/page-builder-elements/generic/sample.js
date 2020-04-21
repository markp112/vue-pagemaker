        let MARGIN = 5;

var box = document.getElementById('box');

box.addEventListener("mousedown", onMouseDown);
box.addEventListener("mousemove", onMouseMove);

function onMouseDown(event) {
    console.log("on mouse down called")
    var box = event.target

    // store the attributes of the WebBox at the time of the mousedown event.
    var computedStyle = window.getComputedStyle(box);
    
    let coordinates = getCoords(box);

    let b = {
        left: coordinates.left,    
        top: coordinates.top,
        height: parseInt(computedStyle.getPropertyValue('height')),
        width: parseInt(computedStyle.getPropertyValue('width')),
    }
    
    // store x and y as the distance between the cursor and the box's left and top.
    var x = event.clientX - b.left;
    var y = event.clientY - b.top;

    // detect if the cursor is within marginal distance of the box's edges
    var onTopEdge = y < MARGIN;
    var onLeftEdge = x < MARGIN;
    var onRightEdge = x >= b.width - MARGIN;
    var onBottomEdge = y >= b.height - MARGIN;

    // determine whether we shift or resize
    var isResizing = onRightEdge || onLeftEdge || onTopEdge || onBottomEdge;

    // Highlighted the currently selected WebBox.
    //highlightWebBox(event.target);

    // Make the WebBox moveable from the stack
    //box.style.position = 'absolute';

    if(isResizing) {

        function onMouseMoveResize(event) {
            if(onRightEdge) {
                box.style.width = (event.clientX - b.left) + 'px';
            }
            if(onBottomEdge) {
                box.style.height = (event.clientY - b.top) + 'px'; 
            }

            if(onLeftEdge) {
                box.style.left = event.clientX - parseInt(computedStyle.getPropertyValue('margin-left')) + 'px';
                box.style.width = (b.left - event.clientX + b.width) + 'px';
            }
            if(onTopEdge) {
                box.style.top = event.clientY - parseInt(computedStyle.getPropertyValue('margin-top')) + 'px';
                box.style.height = (b.top - event.clientY + b.height) + 'px';
            }
        }

        function onMouseUpResize() {
            document.removeEventListener('mousemove', onMouseMoveResize);
            document.removeEventListener('mouseup', onMouseUpResize);
        }

        document.addEventListener('mousemove', onMouseMoveResize);
        document.addEventListener('mouseup', onMouseUpResize);

    }

}

// get document coordinates of the element
function getCoords(elem) {
  let box = elem.getBoundingClientRect();

  return {
    top: box.top + pageYOffset,
    left: box.left + pageXOffset
  };
}

/*
    Cursor style change to indicate when the user can resize vs shift.
*/
function onMouseMove(event) {
    var box = event.target;
    var b = box.getBoundingClientRect();
    var x = event.clientX - b.left;
    var y = event.clientY - b.top;

    var onTopEdge = y < MARGIN;
    var onLeftEdge = x < MARGIN;
    var onRightEdge = x >= b.width - MARGIN;
    var onBottomEdge = y >= b.height - MARGIN;

    if (onRightEdge && onBottomEdge || onLeftEdge && onTopEdge) {
        box.style.cursor = 'nwse-resize';
    } else if (onRightEdge && onTopEdge || onBottomEdge && onLeftEdge) {
        box.style.cursor = 'nesw-resize';
    } else if (onRightEdge || onLeftEdge) {
        box.style.cursor = 'ew-resize';
    } else if (onBottomEdge || onTopEdge) {
        box.style.cursor = 'ns-resize';
    } else {
        box.style.cursor = 'move';
    }

}
