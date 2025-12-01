console.time('solve');
const CAT = {
  ORANGE: {
    HEAD: 1,
    TAIL: -1
  },
  GRAY: {
    HEAD: 2,
    TAIL: -2
  },
  BLACK: {
    HEAD: 3, // big side
    TAIL: -3, // small side
  },
  BROWN: {
    HEAD: 4,
    TAIL: -4
  }
};

const pieces = [
  [ CAT.BROWN.HEAD,
    CAT.ORANGE.HEAD,
    CAT.GRAY.TAIL,
    CAT.BLACK.HEAD
  ],    
  [ CAT.BROWN.TAIL,
    CAT.BLACK.HEAD,
    CAT.BROWN.TAIL,
    CAT.ORANGE.TAIL
  ],
  [ CAT.BROWN.HEAD,
    CAT.GRAY.TAIL,
    CAT.GRAY.HEAD,
    CAT.ORANGE.HEAD
  ],
  [ CAT.GRAY.HEAD,
    CAT.ORANGE.TAIL,
    CAT.BLACK.HEAD,
    CAT.BROWN.TAIL]
];

const TOP = 0;
const RIGHT = 1;
const BOTTOM = 2;
const LEFT = 3;

var permArr = [],
  usedChars = [];

var totalCorrectSolutions = 0;
var totalWrongSolutions = 0;

//console.log(`Result: ${solve(grid)}`);
generateGrids();

function generateGrids() {
  let side = 2;
  let grid = [];
  
  let lists = permute(pieces);
  //let grids = listsToGrids(lists, 2);
  let solutions = solveLists(lists);


  console.timeEnd('solve');
  console.log(`Found ${totalCorrectSolutions} correct solutions`);
  console.log(`Found ${totalWrongSolutions} wrong solutions`);
  //console.log(solutions);
}

function solveLists(lists) {
  lists.forEach(list => solveList(list))
}

function solveList(list) {
  const POSITIONS = 4
  let correctLists = [];
  
  for (let i=0; i<POSITIONS; i++) {
    for (let j=0; j<POSITIONS; j++) {
      for (let k=0; k<POSITIONS; k++) {
        for (let n=0; n<POSITIONS; n++) {
          let rotatedList = list.map((x) => x);
          rotatedList[0] = rotatePiece(rotatedList[0], i);
          rotatedList[1] = rotatePiece(rotatedList[1], j);
          rotatedList[2] = rotatePiece(rotatedList[2], k);
          rotatedList[3] = rotatePiece(rotatedList[3], n);
          //console.log(rotatedList[0], rotatedList[1], rotatedList[2], rotatedList[3]);
          if (solve(listToGrid(list, 2))) {
            correctLists.push(list);
          }
        }
      }
    }
  }
  
  return correctLists;
}

/*
function solveGrids(grids) {
  for (let i=0; i<grids.length; i++) {
    solveRotations(grids[i]);
  }
}
*/

function rotatePiece(piece, distance) {
  for(let i=0; i<distance; i++) {
    let item = piece.pop();
    piece.unshift(item);
  }
  return piece;
}

function listsToGrids(lists, sideLength) {
  var grids = [];
  for (let i=0; i<lists.length; i++) {
    grids.push(listToGrid(lists[i], sideLength));
  }
  return grids;
}

function listToGrid(list, sideLength) {
  let grid = [];
  for(let i=0; i<list.length; i++) {
    let index = Math.floor(i/sideLength);
    if (typeof(grid[index]) === 'undefined') {
      grid[index] = [];
    }
    grid[Math.floor(i/sideLength)].push(list[i]);
  } 
  return grid;
}

function permute(input) {
  let ch, i;
  for (i=0; i<input.length; i++) {
    ch = input.splice(i, 1)[0];
    usedChars.push(ch);
    if (input.length == 0) {
      permArr.push(usedChars.slice());
    }
    permute(input);
    input.splice(i, 0, ch);
    usedChars.pop();
  }
  return permArr
};

function solve(grid) {
  let result = false;
  /*
  console.log(compare(grid[0][0][RIGHT], grid[0][1][LEFT]))
  console.log(compare(grid[0][1][BOTTOM], grid[1][1][TOP]));
  console.log(compare(grid[1][1][LEFT], grid[1][0][RIGHT]));
  console.log(compare(grid[1][0][TOP], grid[0][0][BOTTOM]));
  */
  
  
  if (compare(grid[0][0][RIGHT], grid[0][1][LEFT]) && 
     compare(grid[0][1][BOTTOM], grid[1][1][TOP]) &&
     compare(grid[1][1][LEFT], grid[1][0][RIGHT]) &&
     compare(grid[1][0][TOP], grid[0][0][BOTTOM])) {
    result = true;
    console.log("Correct!", grid);
    if (totalCorrectSolutions == 33) {
      debugger;
    }
    totalCorrectSolutions += 1;
  }
  else {
    totalWrongSolutions += 1;
  }
  return result;
}

function compare(a, b) {
  return a + b === 0;
}

