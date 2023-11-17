This project contains a Sudoku app with the expected functionality:

The board is a 3x3 grid of sub-grids.  Each sub-grid is a 3x3 grid of buttons.
Each button in each sub-grid stores its number in the value field.

When a button from inputs is pressed, it remains selected.  Then, the user can click on a button in any sub-grid to emplace the selected number into the selected button.  At this point, a valid board check will need to be conducted.

When the either the pencil or erase buttons are selected, they will "selected" and remain pressed:
- While Pencil is active, the user can click into any square and emplace up to 9 numbers.  However, these numbers
    will not count towards the validity of the square.  The pencil marks are purely for the end user's convenience as they rule out squares
- While erase is active, the user can clear both pencil marks and entered numbers from any button selected.  However,
    the user will not be able to erase the numbers that were created by the board during board loading.