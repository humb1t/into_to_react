import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
      return (
        <button className="square"  onClick={props.onClick}>
          {props.highlited ? '*' : ''}
          {props.value}
        </button>
      );
    }
  
  class Board extends React.Component {

    renderSquare(i, highlited) {
      return (
      <Square value={this.props.squares[i]} highlited={highlited} onClick={() => this.props.onClick(i)} />
      );
    }

    renderRow(index) {
      const colCount = 3;
      let columns = [];
      const winnerCells = calculateWinner(this.props.squares);
      for (let i = 0; i < colCount; i++) {
        const cellNumber = index * colCount + i;
        const highlited = (winnerCells ? winnerCells.find((value) => {return value === cellNumber }) : false);
        columns.push(this.renderSquare(cellNumber, highlited));            
      }
      return (
          <div className="board-row">
            {columns}
          </div>
      )
    }

    render() {
      let rows = [];
      for (let index = 0; index < 3; index++) {
        rows.push(this.renderRow(index));
      }
      return (
        <div>
          {rows}
        </div>
      );
    }
  }

  class Clock extends React.Component {
    constructor(props) {
      super(props);
      this.state = {date: new Date()};
    }
  
    componentDidMount() {
      this.timerID = setInterval(
        () => this.tick(),
        1000
      );
    }
  
    componentWillUnmount() {
      clearInterval(this.timerID);
    }
  
    tick() {
      this.setState({
        date: new Date()
      });
    }
  
    render() {
      return (
        <div>
          <h1>Hello, world!</h1>
          <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
        </div>
      );
    }
  }
  
  class Game extends React.Component {

    constructor(props){
      super(props);
      this.state = {
        history: [
          {
            squares: Array(9).fill(null),
          }
        ],
        stepNumber: 0,
        xIsNext: true,
        movesSort: 'asc',
      };
    }

    toogleSort(){
      this.setState(
        {
          movesSort: this.state.movesSort === 'asc' ? 'desc' : 'asc',
        }
      );
    }

    handleClick(i){
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[history.length-1];
      const squares = current.squares.slice();
      if (calculateWinner(squares) || squares[i])
      {
        return;
      }
      squares[i] = this.state.xIsNext ? 'X' : 'O';
      this.setState({
        history: history.concat(
          [
            {
              squares: squares,
              location: i,
            }
          ]
        ),
        stepNumber: history.length,
        xIsNext: !this.state.xIsNext,
      });
    }

    jumpTo(step){
      this.setState(
        {
          stepNumber: step,
          xIsNext: (step % 2) === 0,
        }
      );
    }

    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winner = calculateWinner(current.squares);
      const moves = history.map(
        (step, move) => {
          const row = Math.ceil((step.location + 1) / 3);
          const column = step.location +1 - (row -1) *3;
          let desc = move ? 'Go to move #' + move +'(' + row  +',' + column + ')' : 'Go to game start';
          if (move === this.state.stepNumber){
            desc = (<b> {desc} </b>);
          }
          return (
            <li key={move}>
              <button onClick={() => this.jumpTo(move)}>{desc}</button>
            </li>
          );
        }
      );
      let status;
      if (winner) {
        status = 'The winner is: ' + winner[3];
      } else {
        status = 'Next player is: ' + this.state.xIsNext ? 'X' : 'O';
      }
      const sortedMoves = this.state.movesSort === 'asc' ? moves : moves.reverse(); 
      return (
        <div className="game">
          <div className="game-board">
            <Board squares={current.squares} onClick={(i) => this.handleClick(i)} />
          </div>
          <div className="game-info">
            <Clock />
            <div>{status}</div>
            <button onClick={() => this.toogleSort()}>Toogle moves</button>
            <ol>{sortedMoves}</ol>
          </div>
        </div>
      );
    }
  }

  function calculateWinner(squares){
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        lines[i].push(squares[a]);
        return lines[i];
      }
    }
    return null;
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  