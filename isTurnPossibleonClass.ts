type TFigureColor = "white" | "black";
type TLetter = "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h";
type TNumber = "1" | "2" | "3" | "4" | "5" | "6" | "6" | "8";

type TMoveCoord = `${TLetter}${TNumber}`;

interface IGame {
  players: unknown;
  board: Array<Array<object>>;
}

interface IFigure {
  type: string;
  color: string;
  makeMove(
    startPoint: TMoveCoord,
    targetPoint: TMoveCoord,
    board: Array<Array<object>>
  ): void;
}

const alphabet: object = {
  a: 0,
  b: 1,
  c: 2,
  d: 3,
  e: 4,
  f: 5,
  g: 6,
  h: 7,
};

const getArrayOfBoardByRowNumber: object = {
  "1": 7,
  "2": 6,
  "3": 5,
  "4": 4,
  "5": 3,
  "6": 2,
  "7": 1,
  "8": 0,
};

class Rook implements IFigure {
  type = "rook";
  color = "";

  constructor(color: TFigureColor) {
    this.color = color;
  }
  makeMove(
    startPoint: TMoveCoord,
    targetPoint: TMoveCoord,
    board: Array<Array<unknown>>
  ): void {
    const [startPointLetter, startPointNumber] = startPoint.split("");
    const [targetPointLetter, targetPointNumber] = targetPoint.split("");
    const equalLetters: boolean = startPointLetter === targetPointLetter;
    const equalNumbers: boolean = startPointNumber === targetPointNumber;
    const startRowValue =
      board[getArrayOfBoardByRowNumber[startPointNumber]][
        alphabet[startPointLetter]
      ][startPoint];

    this.validateMoveOpportunity(
      startPointLetter,
      startPointNumber,
      targetPointLetter,
      targetPointNumber,
      startRowValue
    );

    // проверяем возможноть хода, если идем по вертикали
    if (equalLetters) {
      const indexArrayStartPoint: number =
        getArrayOfBoardByRowNumber[startPointNumber];
      const indexArrayTargetPoint: number =
        getArrayOfBoardByRowNumber[targetPointNumber];
      const indexRowInArray: number = alphabet[startPointLetter];

      if (startPointNumber > targetPointNumber) {
        // проверяем в какую сторону мы начнем перебо
        for (
          let i: number = indexArrayStartPoint + 1;
          i < indexArrayTargetPoint + 1;
          i++
        ) {
          // @ts-ignore
          const rowValue = Object.values(board[i][indexRowInArray])[0];
          this.checkMoveOpportunity(rowValue, i, indexArrayTargetPoint);
        }
      } else {
        for (
          let i = indexArrayStartPoint - 1;
          i > indexArrayTargetPoint - 1;
          i--
        ) {
          // @ts-ignore
          const rowValue = Object.values(board[i][indexRowInArray])[0];
          this.checkMoveOpportunity(rowValue, i, indexArrayTargetPoint);
        }
      }
    }

    if (equalNumbers) {
      const indexArray: number = getArrayOfBoardByRowNumber[startPointNumber];
      const indexStartRow: number = alphabet[startPointLetter];
      const indexTargetRow: number = alphabet[targetPointLetter];

      if (indexStartRow > indexTargetRow) {
        for (let i = indexStartRow - 1; i > indexTargetRow - 1; i--) {
          // @ts-ignore
          const rowValue = Object.values(board[indexArray][i])[0];
          this.checkMoveOpportunity(rowValue, i, indexTargetRow);
        }
      } else {
        for (let i = indexStartRow + 1; i < indexTargetRow + 1; i++) {
          // @ts-ignore
          const rowValue = Object.values(board[indexArray][i])[0];
          this.checkMoveOpportunity(rowValue, i, indexTargetRow);
        }
      }
    }
  }

  private validateMoveOpportunity(
    startLetter: string,
    startNumber: string,
    targetLetter: string,
    targetNumber: string,
    startRowValue: object
  ) {
    if (startRowValue === null) {
      throw Error("нельзя сходить с пустой ячейки");
    }

    if (startLetter !== targetLetter && startNumber !== targetNumber) {
      throw new Error("ай яй яй, так ходить нельзя");
    }

    if (startLetter === targetLetter && startNumber === targetNumber) {
      throw new Error("ай яй яй, так ходить нельзя");
    }
  }

  private checkMoveOpportunity(
    value: unknown,
    index: number,
    targetIndex: number
  ) {
    if (value != null) {
      if (index === targetIndex) {
        /* убираем фигуру противника и ставим свою */
        console.log("Убираем фигуру противника и ставим свою");
      } else {
        throw new Error("на пути фигура, мы не можем сделать ход");
      }
    }

    if (value === null && index === targetIndex) {
      /* тут мы должны переставить фигуру на targetPoint */
      console.log("Ставим фигуру на таргет поинт");
    }
  }
}

class Pawn implements IFigure {
  type = "pawn";
  color = "";

  constructor(color: TFigureColor) {
    this.color = color;
  }
  makeMove(
    startPoint: TMoveCoord,
    targetPoint: TMoveCoord,
    board: Array<Array<unknown>>
  ): void {
    const [startPointLetter, startPointNumber] = startPoint.split("");
    const [targetPointLetter, targetPointNumber] = targetPoint.split("");
    const isMoveFirst: Boolean =
      +startPointNumber === 7 || +startPointNumber === 2;
    const moduleVerticalFields = Math.abs(
      +startPointNumber - +targetPointNumber
    );
    const moduleHorizontalFields = Math.abs(
      alphabet[startPointLetter] - alphabet[targetPointLetter]
    );
    const startRowValue =
      board[getArrayOfBoardByRowNumber[startPointNumber]][
        alphabet[startPointLetter]
      ][startPoint];
    const targetRowValue =
      board[getArrayOfBoardByRowNumber[targetPointNumber]][
        alphabet[targetPointLetter]
      ][targetPoint];

    this.validateMoveOpportunity(
      startPointNumber,
      targetPointNumber,
      startRowValue
    );

    // логика на первый ход пешки
    if (
      moduleVerticalFields === 2 &&
      startPointLetter === targetPointLetter &&
      isMoveFirst
    ) {
      if (startPointNumber > targetPointNumber) {
        // для черных
        const numberFirstRowInMove = +startPointNumber - 1;
        this.checkMoveOpportunityForFirstMove(
          board,
          String(numberFirstRowInMove),
          targetPointLetter,
          targetRowValue
        );
      }

      if (startPointNumber < targetPointNumber) {
        // для белых
        const numberFirstRowInMove = +startPointNumber + 1;
        this.checkMoveOpportunityForFirstMove(
          board,
          String(numberFirstRowInMove),
          targetPointLetter,
          targetRowValue
        );
      }
    }

    // логика на стандартный ход пешки
    if (moduleVerticalFields === 1 && startPointLetter === targetPointLetter) {
      if (targetRowValue === null) {
        // ставим фигуру на таргет
        console.log("поставили фигуру");
      } else {
        throw Error("поле занято");
      }
    }

    // обработать кейс захвата
    if (moduleVerticalFields === 1 && moduleHorizontalFields === 1) {
      if (targetRowValue === null) {
        throw new Error("так ходить нельзя");
      }
      if (
        (startRowValue.color === "black" && targetRowValue.color === "white") ||
        (startRowValue.color === "white" && targetRowValue.color === "black")
      ) {
        // ставим фигуру на таргет
        console.log("произошел захват, ставим свою фигуру");
      }
    }
  }

  private validateMoveOpportunity(
    startNumber: string,
    targetNumber: string,
    startRowValue: IFigure
  ) {
    const isMoveFirst: Boolean = +startNumber === 7 || +startNumber === 2;

    if (startRowValue === null) {
      // возможно что эта проверка в дальнейшем не нужна. Поэтому она только тут
      throw Error("нельзя сходить с пустой ячейки");
    }

    if (
      (startRowValue.color === "black" && !(startNumber > targetNumber)) || // проверка на верное направление хода
      (startRowValue.color === "white" && !(targetNumber > startNumber))
    ) {
      throw Error("нельзя сходить назад");
    }

    if (Math.abs(+startNumber - +targetNumber) > 2) {
      throw new Error("ай яй яй, так ходить нельзя");
    }

    if (Math.abs(+startNumber - +targetNumber) === 2 && !isMoveFirst) {
      throw new Error("ай яй яй, так ходить нельзя");
    }
  }

  private checkMoveOpportunityForFirstMove(
    board: Array<Array<unknown>>,
    numberFirstRowInMove: string,
    targetPointLetter: string,
    targetRowValue: IFigure | null
  ) {
    // @ts-ignore
    const firstRowInMoveValue = Object.values(
      board[getArrayOfBoardByRowNumber[numberFirstRowInMove]][
        alphabet[targetPointLetter]
      ]
    )[0];
    if (targetRowValue === null && firstRowInMoveValue === null) {
      console.log("ставим пешку на новое место");
    } else {
      throw new Error("упс, а впереди занято");
    }
  }
}

class King implements IFigure {
  type = "rook";
  color = "";

  constructor(color: TFigureColor) {
    this.color = color;
  }

  makeMove(
    startPoint: TMoveCoord,
    targetPoint: TMoveCoord,
    board: Array<Array<unknown>>
  ): void {
    const [startPointLetter, startPointNumber] = startPoint.split("");
    const [targetPointLetter, targetPointNumber] = targetPoint.split("");
    const moduleVerticalFields = Math.abs(
      +startPointNumber - +targetPointNumber
    );
    const moduleHorizontalFields = Math.abs(
      alphabet[startPointLetter] - alphabet[targetPointLetter]
    );
    const startRowValue =
      board[getArrayOfBoardByRowNumber[startPointNumber]][
        alphabet[startPointLetter]
      ][startPoint];
    const targetRowValue =
      board[getArrayOfBoardByRowNumber[targetPointNumber]][
        alphabet[targetPointLetter]
      ][targetPoint];
    const possibleDiff = [0, 1];

    if (
      // надо решить проблему !!!!!
      //@ts-ignore
      possibleDiff.indexOf(moduleHorizontalFields) === -1 ||
      possibleDiff.indexOf(moduleVerticalFields) === -1
      // !possibleDiff.includes(moduleHorizontalFields) ||
      // !possibleDiff.includes(moduleVerticalFields)
    ) {
      throw new Error("Так ходить нельзя королю");
    }

    if (targetRowValue !== null) {
      if (
        (startRowValue.color === "black" && targetRowValue.color === "white") ||
        (startRowValue.color === "white" && targetRowValue.color === "black")
      ) {
        // ставим фигуру на таргет
        console.log("произошел захват, ставим короля");
      } else {
        throw new Error("нельзя захватить свою фигуру");
      }
    } else {
      //ставим на таргет
      console.log("тут пусто, ставим короля");
    }
  }
}

class Elephant implements IFigure {
  type = "rook";
  color = "";

  constructor(color: TFigureColor) {
    this.color = color;
  }

  makeMove(
    startPoint: TMoveCoord,
    targetPoint: TMoveCoord,
    board: Array<Array<unknown>>
  ): void {
    const [startPointLetter, startPointNumber] = startPoint.split("");
    const [targetPointLetter, targetPointNumber] = targetPoint.split("");
    const moduleVerticalFields = Math.abs(
      +startPointNumber - +targetPointNumber
    );
    const moduleHorizontalFields = Math.abs(
      alphabet[startPointLetter] - alphabet[targetPointLetter]
    );
    const startRowValue: IFigure | null =
      board[getArrayOfBoardByRowNumber[startPointNumber]][
        alphabet[startPointLetter]
      ][startPoint];
    const targetRowValue: IFigure | null =
      board[getArrayOfBoardByRowNumber[targetPointNumber]][
        alphabet[targetPointLetter]
      ][targetPoint];

    if (moduleHorizontalFields !== moduleVerticalFields) {
      throw new Error("упс, так ходить нельзя");
    }

    if (
      // ходим в правый верхний угол
      startPointNumber < targetPointNumber &&
      alphabet[startPointLetter] < alphabet[targetPointLetter]
    ) {
      this.checkMoveOpportunityForFirstMove(
        moduleHorizontalFields,
        board,
        startPointNumber,
        startPointLetter,
        targetRowValue,
        startRowValue,
        true,
        true
      );
    }

    if (
      // ходим в левый верхний угол
      startPointNumber < targetPointNumber &&
      alphabet[startPointLetter] > alphabet[targetPointLetter]
    ) {
      this.checkMoveOpportunityForFirstMove(
        moduleHorizontalFields,
        board,
        startPointNumber,
        startPointLetter,
        targetRowValue,
        startRowValue,
        true,
        false
      );
    }

    if (
      // ходим в левый нижний угол
      startPointNumber > targetPointNumber &&
      alphabet[startPointLetter] > alphabet[targetPointLetter]
    ) {
      this.checkMoveOpportunityForFirstMove(
        moduleHorizontalFields,
        board,
        startPointNumber,
        startPointLetter,
        targetRowValue,
        startRowValue,
        false,
        false
      );
    }

    if (
      // ходим в правый нижний угол
      startPointNumber > targetPointNumber &&
      alphabet[startPointLetter] < alphabet[targetPointLetter]
    ) {
      this.checkMoveOpportunityForFirstMove(
        moduleHorizontalFields,
        board,
        startPointNumber,
        startPointLetter,
        targetRowValue,
        startRowValue,
        false,
        true
      );
    }
  }

  private checkMoveOpportunityForFirstMove(
    moduleHorizontalFields: number,
    board: Array<Array<unknown>>,
    startPointNumber: string,
    startPointLetter: string,
    targetRowValue: IFigure | null,
    startRowValue: IFigure | null,
    goUpOnBoard: boolean,
    goRightOnBoard: boolean
  ) {
    for (let i = 1; i < moduleHorizontalFields; i++) {
      // получаем индекс массива по number
      let arrayOfRow: unknown[];
      if (goUpOnBoard) {
        arrayOfRow =
          board[getArrayOfBoardByRowNumber[String(+startPointNumber + i)]];
      } else {
        arrayOfRow =
          board[getArrayOfBoardByRowNumber[String(+startPointNumber - i)]];
      }
      // получаем букву ячейки хода
      let letterRowInMove: string;
      if (goRightOnBoard) {
        //@ts-ignore
        letterRowInMove = Object.keys(alphabet)[alphabet[startPointLetter] + i];
      } else {
        //@ts-ignore
        letterRowInMove = Object.keys(alphabet)[alphabet[startPointLetter] - i];
      }
      // получаем объект ячейки
      const rowObj = arrayOfRow[alphabet[letterRowInMove]];
      //@ts-ignore
      if (Object.values(rowObj)[0] !== null) {
        throw new Error("впереди фигура, нельзя дойти до таргет");
      }
    }

    // проверяем target
    if (targetRowValue !== null) {
      if (
        (startRowValue.color === "black" && targetRowValue.color === "white") ||
        (startRowValue.color === "white" && targetRowValue.color === "black")
      ) {
        // ставим фигуру на таргет
        console.log("произошел захват, ставим слона");
      } else {
        throw new Error("нельзя захватить свою фигуру");
      }
    } else {
      console.log("ставим на таргет слона");
    }
  }
}

class Horse implements IFigure {
  type = "rook";
  color = "";

  constructor(color: TFigureColor) {
    this.color = color;
  }

  makeMove(
    startPoint: TMoveCoord,
    targetPoint: TMoveCoord,
    board: Array<Array<unknown>>
  ): void {
    const [startPointLetter, startPointNumber] = startPoint.split("");
    const [targetPointLetter, targetPointNumber] = targetPoint.split("");
    const moduleVerticalFields = Math.abs(
      +startPointNumber - +targetPointNumber
    );
    const moduleHorizontalFields = Math.abs(
      alphabet[startPointLetter] - alphabet[targetPointLetter]
    );
    const startRowValue: IFigure | null =
      board[getArrayOfBoardByRowNumber[startPointNumber]][
        alphabet[startPointLetter]
      ][startPoint];
    const targetRowValue: IFigure | null =
      board[getArrayOfBoardByRowNumber[targetPointNumber]][
        alphabet[targetPointLetter]
      ][targetPoint];

    if (
      (moduleVerticalFields !== 1 && moduleHorizontalFields !== 2) &&
      (moduleVerticalFields !== 2 && moduleHorizontalFields !== 1)
    ) {
      throw new Error("так конь ходить не может");
    }

    if (targetRowValue !== null) {
      if (
        (startRowValue.color === "black" && targetRowValue.color === "white") ||
        (startRowValue.color === "white" && targetRowValue.color === "black")
      ) {
        // ставим фигуру на таргет
        console.log("произошел захват, ставим коня");
      } else {
        throw new Error("нельзя захватить свою фигуру");
      }
    } else {
      console.log("ставим на таргет коня");
    }
  }
}

class Queen implements IFigure {
  type = "rook";
  color = "";

  constructor(color: TFigureColor) {
    this.color = color;
  }

  makeMove(
    startPoint: TMoveCoord,
    targetPoint: TMoveCoord,
    board: Array<Array<unknown>>
  ): void {}
}

class GameBoard implements IGame {
  players: unknown;

  board = [
    [
      { a8: new Rook("black") },
      { b8: new Horse("black") },
      { c8: new Elephant("black") },
      { d8: new King("black") },
      { e8: new Queen("black") },
      { f8: new Elephant("black") },
      { g8: new Horse("black") },
      { h8: new Rook("black") },
    ],
    [
      { a7: new Pawn("black") },
      { b7: new Pawn("black") },
      { c7: new Pawn("black") },
      { d7: new Pawn("black") },
      { e7: new Pawn("black") },
      { f7: new Pawn("black") },
      { g7: new Pawn("black") },
      { h7: new Pawn("black") },
    ],
    [
      { a6: null },
      { b6: null },
      { c6: null },
      { d6: null },
      { e6: null },
      { f6: null },
      { g6: null },
      { h6: null },
    ],
    [
      { a5: null },
      { b5: null },
      { c5: null },
      { d5: null },
      { e5: null },
      { f5: null },
      { g5: null },
      { h5: null },
    ],
    [
      { a4: null },
      { b4: null },
      { c4: null },
      { d4: new Elephant("black") },
      { e4: null },
      { f4: null },
      { g4: null },
      { h4: null },
    ],
    [
      { a3: null },
      { b3: null },
      { c3: null },
      { d3: null },
      { e3: null },
      { f3: null },
      { g3: null },
      { h3: null },
    ],
    [
      { a2: new Pawn("white") },
      { b2: new Pawn("white") },
      { c2: new Pawn("white") },
      { d2: new Pawn("white") },
      { e2: new Pawn("white") },
      { f2: new Pawn("white") },
      { g2: new Pawn("white") },
      { h2: new Pawn("white") },
    ],
    [
      { a1: new Rook("white") },
      { b1: new Horse("white") },
      { c1: new Elephant("white") },
      { d1: new King("white") },
      { e1: new Queen("white") },
      { f1: new Elephant("white") },
      { g1: new Horse("white") },
      { h1: new Rook("white") },
    ],
  ];
}

let a = new GameBoard();
let b = a.board[4][3]["d4"].makeMove("d4", "e5", a.board);
console.log(b);
console.log("hello");
