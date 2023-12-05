import React, { Component } from 'react';

export class SudokuButton extends Component{

    constructor(props){
        super();

        this.isDefault = false;
        if (props.value !== " "){
            this.isDefault = true;
        }
        
        this.state = {
            inError : false,
        }

        this.id = props.id;              
        this.handleClick = this.handleClick.bind(this);
        this.parentBoard = props.board;
        this.boardLocation = props.id;

        this.pencilHTML = ""; // Contains all divs to be rendered inside pencilButtonOverlay
        this.pencilsLength = 0; // How many pencil marks the SudokuButton is aware it has

    }

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

        if (this.parentBoard.updateBoard(this.id) === false){
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