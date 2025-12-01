var NameGenerator = function() {

  const houseCatNames = ["Mittens", "Snowball", "Pumpkin","Oscar","Bella","Pepper","Fred","Tammy","Buttercup",
                         "Peaches","Rocky", "Spud","Ruby","Socks","Boris","Bob","Frankie","Smudge","Hattie","Allie","Jigsaw","Spot",
                         "Patches","Mocha","Spooky"
                         ,"Duke","Pattie","Selma","Simon","Chester","Tiny","Eva","Hallie","Molly","Max","Debby","Speckles","Riley",
                         "Hutch","Boris","Mitzi","Hutch","Smokey","Domino","Lizzie","Ebony","Freckles","Cody","Mitch","Pokey",
                         "Ralph","Richie","Tai","Fluffy","Isac","Bubbles","Wilma","Minty","Amy","Topaz","Sapphire","Polly","Pearl","Diamond",
                         "Andy","Twiggy","Tangy","Minty","Loki","Zelda","Hector","Eddie","Twiggy","Tangy","Emily",
                         ,"Apple","Petunia","Marie","Rose","Fudge","Puck","Madric","Rodric","Fuzzball","Eliza","Peanut","Sabrina"
                         ,"Sadie","Primrose","Nora","Mimi","Ziggy","Freya","Fey","Angel","Buddy","Dylan","Dotty","Minnie","Beau"
                         ,"Zeke","Lexi","Sassy","Toby","Missy","Lucy","Chip","Alf"
                        ];
  
  const rogueNames = ["Stick","Cora","Woody","Jingo","Leaf","Egg","Bean","Onion","Rusty","Brick","Bone","Rain","Flora",
                     "Stripes","Pine","Jumper","Hoot","Cod","Sol","Tiny","Cobble","Stumpy","Twig","Rock","Flame","Raven",
                     "Splinter","Beetle","Slash","Purdy","Swallow","Spinner","Sniper","Snook","Billie","Frosty","Boulder",
                     "Scourge","Opal","Randy","Jag","Mowgli","Chip","Shorty","Snag","Sol","Rip","Scale","Red","Swallow","Draco",
                      ,"Minty","Snipe","Hag","Moll","Moony","Frilla","Twilla","Kudzu","Mullein","Teasel","Leek","Henbit",
                     "Primrose","Shale","Louie","Lutta","Sooty","Trout","Echo","Freya","Bob"]; 
  
  
  const part1 = [
    "Leaf","Stone","Quick","Apple","Ash","Acorn","Alder",
    "Adder","Ant","Bird","Bright","Breeze","Briar","Bark","Bush",
    "Badger","Blue","Blossom","Bramble","Bracken","Beetle",
    "Beech","Birch","Berry","Bee", "Bumble","Bounce","Black","Cherry","Cinder","Crow","Cloud","Claw",
    "Clover","Ceder","Damp","Dim","Dark","Dawn","Deer","Dust","Ember","Flower","Fast","Flick","Free","Feather","Flat","Fir",
    "Gold","Needle","Spark","Willow","Pine","Reed","Grass","Pebble","Red","Yellow","Mallow","Yarrow","Twig","Violet",
    "Fox","Ice","Moss","Maple","Toad","Rose","Daisy","Juniper","Dandelion","Lily","Mint","Sage","Tansy","Lark","Honey",
    "Fern","Poppy","Mole","Vole","Gorse","Heather","Marigold","White","Sand","Misty","Sorrel","Soot","Rain","Tawny","Oak",
    "Rowan","Talon","Owl","Hawk","Falcon","Snake","Whorl","Slate","Shrew","Spider","Mouse","Thrush","Sparrow","Starling"
    ,"Magpie","Finch","Squirrel","Stone","Ginger","Silver","Gray","Marsh","Tiny","Small","Little","Moth","Robin","Tiger",
    "Leopard","Lion","Snow","Storm","Drizzle","Fog","Frog","Raven","Trout","Minnow","Holly","Thorn","Borage","Parsley",
    "Comfrey","Dock","Chervil","Chamomile","Rock","Plum","Rabbit","Hare","Thistle","Brook","Nettle","Flare","Lake","Swift"
    ,"Meadow","Dove","Amber","Hedge","Tall","Rat","Scorch","Snail","Swoop","Hemlock","Green","Lizard","Jay","Hazel","Thorn",
    "Boulder","Storm","Long","Russet","Smoke","Kestrel","Torn","Night","Weasel","Morning","Web","Rock","Ripple","Dapple",
    "Pounce","Prickle","Petal","Fawn","Swallow","Dusk","Wing","Heron","Screech","Splash","Dew","Seed","Echo","Puddle",
    "Kink","Furze","Sedge","Slight","Oat","Slight","Hoot","Brindle","Frost","Curl","Pod","Shimmer","Haven","Perch",
    "Sneeze","Sun","Hornet","Pink","Turtle","Frost","Goose","Mallard","Tumble","Celendine","Sleek","Spike","Wasp","Strike",
    "Purple","Chicory","Gopher","Chipmunk","Beaver","Weed","Indigo","Chaffinch","Running","Creek","Brittle","Sap","Dew","Pheasant",
    "Chive","Freckle","Bloom","Milk","Eel","Midge","Sloe","Doe","Buck","Swift","Stagle","Flash","Fallow","Hound","Larch","Hail",
    "Pear","Sharp","Tangle","Fire","Bud","Pike","Primrose","Long","Half","Pollen","Jagged","Bubble","Howl","Locust",
    "Finch","Root","Shell","Stem","Eagle","Mango","Cricket","Mantis","Stumpy","Cypress","Guppy","Algae","Hive","Harebell","Fireweed"
    ,"Leek","Shale","Autumn","Winter","Summer","Clove","Chert","Arkose","Oleander","Stag","Jasmine","Morel","Chanterelle",
    
    
    
    
     
  ];
  
  const part2 = [
    "Tail","Fur","Pelt","Claw","Foot","Ear","Eye","Whisker","Face",
    "Tooth","Fang","Feather","Wing","Pool","Fall","Heart","Leaf",
    "Tuft","Stripe","Berry","Nose","Shade","Patch","Fire","Flame","Mist","Shine","Leg","Seed","Stream","Muzzle","Willow"
    ,"Leap","Flight","Step","Spring","Cloud","Splash","Light","Breeze","Sting","Moon","Storm","Fern","Cinder","Scar","Poppy"
    ,"Scratch","Shell","Water","Bird","Flower","Blaze","Petal","Bush","Song","Frost","Spike","Strike","Dapple",
    "Petal","Thorn","Tail","Fur","Pelt","Claw","Foot","Whisker","Face","Spot","Web","Heart","Snout","Toe","Wish","Talon","Dusk",
    "Thistle","Burr","Whisper","Roar","Hop","Drizzle","Shadow","Bloom","Tail","Fur","Pelt"
    

  ];
  
  function rand(max) {
    return Math.floor(Math.random()*max);	   
  }
  
  this.getName = function(type) {
    if (type === 'domesticated') {
      var first = rand(houseCatNames.length);
      return [houseCatNames[first],''];
    }
    else {
      var first = rand(part1.length);
      var last = rand(part2.length);
      return [part1[first], part2[last].toLowerCase()];
    }
  }
  
  return this;
}