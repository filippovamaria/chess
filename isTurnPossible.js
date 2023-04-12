const alphabet = {
    "a": 1,
    "b": 2,
    "c": 3,
    "d": 4,
    "e": 5,
    "f": 6,
    "g": 7,
    "h": 8
}
const fieldsLetters = Object.keys(alphabet)

function isTurnPossible(figure, startPlaceOnBoard, targetPlaceOnBoard) {

    const figureNameToCheckMovePossibilityFunctionMap = {
        "pawn": isPossibleMoveForPawn,
        "king": isPossibleMoveForKing,
        "queen": isPossibleMoveForQueen,
        "rook": isPossibleMoveForRook,
        "elephant": isPossibleMoveForElephant,
        "horse": isPossibleMoveForHorse
    }
    const [startLetterCoord, startNumberCoord] = startPlaceOnBoard.toLowerCase();
    const [targetLetterCoord, targetNumberCoord] = targetPlaceOnBoard.toLowerCase();
    const isMovePossible = figureNameToCheckMovePossibilityFunctionMap[figure]

    validatePlaceCoord([startLetterCoord, startNumberCoord])
    validatePlaceCoord([targetLetterCoord, targetNumberCoord])

    if ((startLetterCoord === targetLetterCoord) &&
        (startNumberCoord === targetLetterCoord)) {
        throw new Error("нельзя не совершать ход")
    }

    const possibleMoveCalculations = {
        startLetterCoord,
        startNumberCoord: Number(startNumberCoord),
        targetLetterCoord,
        targetNumberCoord: Number(targetNumberCoord),
        moduleOfGorizontalField: Math.abs(alphabet[startLetterCoord] - alphabet[targetLetterCoord]),
        moduleOfVerticalField: Math.abs(startNumberCoord - targetNumberCoord)
    }

    return isMovePossible(possibleMoveCalculations)
}

function isPossibleMoveForPawn({ startLetterCoord, startNumberCoord, targetLetterCoord, targetNumberCoord }) {

    const possibleMoveForwardByNumberCoord = startNumberCoord + 1

    if (startNumberCoord === 8) {
        return false
    }

    return possibleMoveForwardByNumberCoord === targetNumberCoord && startLetterCoord === targetLetterCoord
}

function isPossibleMoveForKing({ moduleOfGorizontalField, moduleOfVerticalField }) {

    const possibleDiff = [0, 1];
    return possibleDiff.includes(moduleOfGorizontalField) && possibleDiff.includes(moduleOfVerticalField)
}

function isPossibleMoveForQueen(params) {

    return isPossibleMoveForRook(params) || isPossibleMoveForElephant(params)
}

function isPossibleMoveForRook({ startLetterCoord, startNumberCoord, targetLetterCoord, targetNumberCoord }) {

    return startLetterCoord === targetLetterCoord || startNumberCoord === targetNumberCoord
}

function isPossibleMoveForElephant({ moduleOfGorizontalField, moduleOfVerticalField }) {

    return moduleOfGorizontalField === moduleOfVerticalField
}

function isPossibleMoveForHorse({ moduleOfGorizontalField, moduleOfVerticalField }) {

    return (moduleOfVerticalField === 1 && moduleOfGorizontalField === 2) ||
        (moduleOfVerticalField === 2 && moduleOfGorizontalField === 1)
}

function validatePlaceCoord([letterCoord, numberCoord]) {
    const regexLetter = new RegExp('[a-h]');
    const regexNumber = new RegExp('[1-8]');

    if (!regexLetter.test(letterCoord) || !regexNumber.test(numberCoord)) {
        throw new Error("нет такого поля на доске")
    }
}

console.log(isTurnPossible("queen", "a1", "b2"))