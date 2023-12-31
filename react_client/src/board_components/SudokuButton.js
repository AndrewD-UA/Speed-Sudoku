import React, { Component } from 'react';

export class SudokuButton extends Component{

    constructor(props){
        super();

        // Check during initialization to see if this square is default (provided by the website)
        this.isDefault = false;
        if (props.value !== " "){
            this.isDefault = true;
        }
        
        this.state = {
            inError : false,
        }

        this.boardLocation = props.id;      // Used to identify which square this is within the subBoard
        this.parentBoard = props.board;     // Contains reference to parent subBoard    

        this.pencilHTML = "";               // Contains all divs to be rendered inside pencilButtonOverlay
        this.pencilsLength = 0;             // How many pencil marks the SudokuButton is aware it has

        this.handleClick = this.handleClick.bind(this); // Bind click handler
    }

    /**
     * Set the sudoku button to be error, and in 3 seconds set it back to being unerrored.
     */
    setErrored(){
        this.setState({
            inError: true,
        });

        setTimeout(() => {
            this.setState({
                inError: false
            })
        }, 3000)
    }
    /**
     * If this is not a default square, send the update request up to the board.
     * @returns Null
     */
    handleClick(){
        if (this.isDefault){
            return;
        }

        if (this.parentBoard.updateBoard(this.boardLocation) === false){
            this.setErrored();
        } else if (this.state.inError){
            this.setState({
                inError: false
            })
        }
    }

    /**
     * The intention of this method is to prevent us from re-generating the pencil marks every single time we render a square.
     * Instead, the pencil marks are statically stored and only updated when a new element is detected.
     * @returns     A reference to this.pencilHTML, which stores the pencilMarks.
     */
    getPencilMarks(){
        if (this.props.value !== " "){
            return //<div></div>;
        }   

        if (this.pencilsLength !== this.props.pencils.length){
            this.pencils = [...this.props.pencils];

            this.pencilHTML =  this.props.pencils.map((pencilMark) => {
                return  <div key={`pencil${this.parentBoard.id}${this.boardLocation}${pencilMark}`}>
                        { pencilMark }
                        </div>
            });         
        }

        return this.pencilHTML;     
    }

    /**
     * Render function returns a parent container buttonSpace
     * buttonSpace contains both the input button and an overlay, used for pencil mode.
     * @returns parent container buttonSpace with button and overlay
     */
    render(){
        return  <div className="buttonSpace">       
                    <input  className= { this.isDefault ? 
                        "defaultButton" : this.state.inError ? 
                            "errorButton" : "gameButton" } 
                        type="button" 
                        value={this.props.value}
                        onClick={this.handleClick} 
                        id = {this.boardLocation}>
                    </input> 
                    <div className = "pencilButtonOverlay">
                                    {
                                        this.getPencilMarks()
                                    }
                    </div>
                </div>
    }
}