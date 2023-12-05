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

        this.pencilHTML = "";
        this.pencils = [];

        //console.log(`${this.parentBoard.id}${this.boardLocation}` + this.isDefault);

    }

    setErrored(){
        this.setState({
            inError: true
        });
    }
    /**
     * If this is not a default square, send the update request up to the board.
     * @returns Null
     */
    handleClick(){
        if (this.isDefault){
            return;
        }

        this.parentBoard.updateBoard(this.id);
    }

    /**
     * The intention of this method is to prevent us from re-generating the pencil marks every single time we render a square.
     * Instead, the pencil marks are statically stored and only updated when a new element is detected.
     * @returns     A reference to this.pencilHTML, which stores the pencilMarks.
     */
    getPencilMarks(){   
        if (this.pencils.length !== this.props.pencils.length){
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