/* globals

babyData

*/
function run() {
  var year = document.getElementById("year").value;
  var name = document.getElementById("name").value.trim();
  document.getElementById("results-list").innerHTML = "";

  if (year < 1880) {
    year = 1880;
  } else if (year > 2018) {
    year = 2018;
  }

  runQuery(year, name);
}

function runQuery(year, name) {
  var temp = JSON.parse(JSON.stringify(babyData));
  var yearData = temp.filter(function(item) {
    return item.year == year;
  });
  var rank = yearData.filter(function(item) {
    return item.name.toLowerCase() == name.toLowerCase();
  });
  var found = false;

  if (rank.length > 0) {
    var baby = rank.sort(function(a, b) {
      return a.name - b.name;
    })[0];
    found = true;
  } else {
    baby = yearData[4];
  }

  var list = yearData.filter(function(item) {
    return item.rank > baby.rank - 5 && item.rank <= baby.rank + 5;
  });
  var insertPosition = getRandomInt(0, list.indexOf(baby) - 1);
  insertPosition = insertPosition < 0 ? 0 : insertPosition;
  var previousRankKey = list[0].rank;
  list.splice(insertPosition, 0, {
    year: year,
    rank: 0,
    name: "Harambe"
  });
  list = rerankList(list, previousRankKey);
  buildList(list, name, found);
  updateView(year, name, baby.rank, found);
}

function rerankList(list, key) {
  for (var i = 0; i < list.length; i++) {
    list[i].rank = key + i;
  }
  return list;
}

function buildList(list, search, found) {
  list.forEach(function(item, i) {
    setTimeout(() => {
      addToList(`${item.rank} ${item.name}`, item.name == search && found);
    }, i * 200);
  });
}

function addToList(string, highlight) {
  var list = document.getElementById("results-list");
  var item = document.createElement("li");
  item.innerHTML = string;
  list.appendChild(item);
  setTimeout(function() {
    item.className = item.className + " show";
    if (highlight) {
      item.className = item.className + " highlight";
    }
  }, 10);
}

function getRandomInt(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

function updateView2(year, name, rank, found) {
  if (found) {
    document.getElementById(
      "results-title"
    ).innerHTML = `${name} was ranked #${rank} in the USA in ${year}`;
    document.getElementById(
      "results-text"
    ).innerHTML = `Other popular names that year`;
  } else {
    document.getElementById(
      "results-title"
    ).innerHTML = `${name} wasn't one of the top 100 baby names in the USA in ${year}`;
    document.getElementById(
      "results-text"
    ).innerHTML = `Here are the most popular names that year`;
  }
}

function updateView(year, name, rank, found) {
  if (found) {
    document.getElementById(
      "results-title"
    ).innerHTML = `${name} was ranked #${rank} in the USA in ${year}`;
    document.getElementById(
      "results-text"
    ).innerHTML = `Other popular names that year`;
  } 
 else if (name.toLowerCase() == "harambe") {
    document.getElementById(
      "results-title"
    ).innerHTML = `${name} was one of the most popular baby names in the USA in ${year}!`;
    document.getElementById(
      "results-text"
    ).innerHTML = `Here are the most popular names that year`;
  }
  else {
    document.getElementById(
      "results-title"
    ).innerHTML = `${name} wasn't one of the top 100 baby names in the USA in ${year}`;
    document.getElementById(
      "results-text"
    ).innerHTML = `Here are the most popular names that year`;
  }
}
