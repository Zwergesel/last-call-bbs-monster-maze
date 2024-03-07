PLAYAREA_WIDTH = 35;
PLAYAREA_HEIGHT = 20;
PLAYAREA_X = 0;
PLAYAREA_Y = 1;
TUTORIAL_X = 36;
TUTORIAL_Y = 0;
TUTORIAL_WIDTH = 20;
TUTORIAL_HEIGHT = 20;

SAVEGAME_VERSION = 2;

SCREEN_GAME = 1;
SCREEN_STATS = 2;

REPLAY_START_DELAY = 30;
REPLAY_DELAY = 15;
MOVE_DELAY = 14;
WALK_AT = 12;
PROWL_AT = [10, 4];
HALFSTEP_AT = [7, 1];
SIMULATE_AT = [11, 6];

MOVE_SYMBOLS = "▲▼<>♦";
CRYPT_SYMBOLS = "abcdefghijklmnopqrstuvwxyz012345";

let screen;
let stats;
let moves;
let moveDelay;
let lastMove;
let undoCounter;
let undoSteps;
let replay;
let replayDelay;
let replayBlink = true;
let monsters;
let treasures;
let gates;
let buttons;
let player;
let level;
let animations;
let gatesOpen;
let gameOver;
let messages = [];
let cheatBuffer = "";

const levels = [{
    template: [
        "    ###########    ",
        "    #. . . . .#    ",
        "    #         #    ",
        "    #. . . M .#    ",
        "  ###         ###  ",
        "  #. . . . . . .#  ",
        "  # ###     #####  ",
        "  #. T . . . . .#  ",
        "###             ###",
        "#. . . . . . . . .#",
        "#                 #",
        "#. . . . P . . . .#",
        "#########-#########",
    ],
    grades: [8, 9, 10, 12],
    solution: "un2zm0rsa"
},
{
    template: [
        "  #############  ",
        "  #. . . . . .#  ",
        "###     ###   ###",
        "#. . . . .#. . .#",
        "#   ##### # #   #",
        "#. M . . . .#. .#",
        "#     ### ###   #",
        "#. . . .#. . . .#",
        "###     ###   ###",
        "  #. P . . T .I  ",
        "  #############  ",
    ],
    grades: [20, 22, 26, 32],
    solution: "jhieriwneoyabqo"
},
{
    template: [
        "#########-###",
        "#M . . . . .#",
        "# # ### ### #",
        "#.#. . . . .#",
        "# #     ### #",
        "#. . P .#. .#",
        "### ### ### #",
        "#T . . . . .#",
        "#############",
    ],
    grades: [16, 17, 20, 24],
    solution: "txwhshlz2nsgm"
},
{
    template: [
        "  ###########",
        "  #.#. . . P#",
        "### ### #   #",
        "#. . . .#. .I",
        "###     # # #",
        "#. . . .#.#M#",
        "### ### ### #",
        "#T#P . .#. .#",
        "# # ### #   #",
        "#. . T#. . .#",
        "#   ##### ###",
        "#. . . . .#  ",
        "###########  ",
    ],
    grades: [27, 32, 36, 50],
    solution: "iicpgvdzbp0tluxmq5s"
},
{
    template: [
        "###-#########",
        "#. .#. . P T#",
        "### #   #   #",
        "#T . M .#. .#",
        "# ### # ### #",
        "#. . .#.#. .#",
        "# # #####   #",
        "#.#. .#T . .#",
        "### ##### ###",
        "#. . . . .#  ",
        "###########  ",
    ],
    grades: [35, 39, 50, 80],
    solution: "ylimpfoohozbiooii45kcmo"
},
{
    template: [
        "#-#   #######                      ",
        "#P#   #. . .#                      ",
        "# #   # ### #                      ",
        "#.#   #.# #.#                      ",
        "# ##### ### #####               ###",
        "#. . . .G. B . .#               #M#",
        "############### ################# #",
        "              #T . . . . . . . . .#",
        "              #####################",
    ],
    grades: [26, 27, 30, 40],
    solution: "o5hllxvdfse5inbjbf"
},
{
    template: [
        "###############",
        "#. . . .#. . .#",
        "# ##### # ### #",
        "#. B .#. .#. .#",
        "#     #g# #   #",
        "#. . .#.#. . T#",
        "# ### # # #   #",
        "#. . . .#.#. .#",
        "#   ##### ### #",
        "#. . . P . . .#",
        "#       #     #",
        "IM . . .#. . .#",
        "###############",
    ],
    grades: [50, 52, 58, 66],
    solution: "a5egmndme4dzh5uuofghitfvog1jyg"
},
{
    template: [
        "  ###################  ",
        "  #. . . . . . . . .#  ",
        "### #####       ### ###",
        "#. . T .#. . T .#. . .#",
        "# ### # #       #   # #",
        "#. . .#. . . . . . .#.#",
        "###   ###########   # #",
        "  #. .#         #. . .#",
        "  ### #   #######   ###",
        "  #. .#   #.#. . . .#  ",
        "  ### ##### #   ### #  ",
        "    #. . T . . . . T#  ",
        "    ###           # #  ",
        "      #. . . . P .#M#  ",
        "      #########-#####  ",
    ],
    grades: [44, 48, 54, 64],
    solution: "eboebfwj3w0q0gcpilwzcvkaizd"
},
{
    template: [
        "#####-#######",
        "#.#. . . P T#",
        "# # ### ### #",
        "#. . . .#.#.#",
        "# ###   # # #",
        "#. . . . M .#",
        "#   #     ###",
        "#. .#. . . .#",
        "# ##### # # #",
        "#. .#T#.#.#.#",
        "### # ##### #",
        "#. . . . . .#",
        "#############",
    ],
    grades: [40, 42, 46, 52],
    solution: "1bpifxuo33cwagkijhle42tsy"
},
{
    template: [
        "#######-#####",
        "#M . .#. . M#",
        "#   ####### #",
        "#. P . .#. .#",
        "###   # # # #",
        "#. . .#. .#.#",
        "# ######### #",
        "#. . . . .#.#",
        "### ##### # #",
        "#. . . .#.#.#",
        "# ##### # # #",
        "#. .#. .#.#.#",
        "### ### # # #",
        "#T . . .#. .#",
        "#############",
    ],
    grades: [58, 62, 68, 78],
    solution: "d3wmfqgldz0vibbdlvi0frc2hfhhpncg3n"
},
{
    template: [
        "#############",
        "#. . . . . .#",
        "###         #",
        "#.#. . . T .#",
        "# #         #",
        "I. . . . . .#",
        "#         # #",
        "#. . . . P#.#",
        "# #   #   # #",
        "#.#M .#. . .#",
        "# # # ##### #",
        "#. .#. . . .#",
        "#############",
    ],
    grades: [34, 36, 42, 60],
    solution: "ymgejlsz3wovepdgdc44dx"
},
{
    template: [
        "#############",
        "IM .gB T . P#",
        "#   ###   ###",
        "#. .#.#. . .#",
        "# ### #   # #",
        "#. . . . .#.#",
        "#   #   ### #",
        "#. .#. .#.#.#",
        "# # #   # # #",
        "#.#. . . .#.#",
        "#####     # #",
        "#. . . . . .#",
        "#############",
    ],
    grades: [48, 52, 58, 68],
    solution: "pfcponibp1yvabxwrhflnsf5pes3m"
},
{
    template: [
        "#####################",
        "#. T . . . . . . . .#",
        "# ### ###     # ### #",
        "#. . .#.#. . .#. .#.#",
        "#     # #     # ### #",
        "#. . . . . . . . . .#",
        "# #                 #",
        "#.#. . . . . . M . .#",
        "# #   #       ### ###",
        "#. . .#. . . . . . .#",
        "# # # #         ### #",
        "#.#.#. . . . . . . .#",
        "### #               #",
        "#. . . . P . . . . .#",
        "# ### ###   #     # #",
        "#.#.#. . . .#. . .#.#",
        "# # #####   # ### ###",
        "#. . .#. . . . . . .#",
        "#####-###############",
    ],
    grades: [82, 88, 100, 140],
    solution: "ebxwreen3yy3ebogbnel3j0bonwcimun5qe5cpicr513km"
},
{
    template: [
        "  #############  ",
        "  #M .#. . . M#  ",
        "  #   ##### ###  ",
        "  #. . .#T . T#  ",
        "  # ### #     #  ",
        "  #. B#. . . .#  ",
        "### # #G# ### #  ",
        "#. .#. P . . .#  ",
        "# ### ###   #####",
        "#. . .#. . .#T TI",
        "### ##### # # ###",
        "  #. . . .#T T#  ",
        "  #############  ",
    ],
    grades: [51, 54, 59, 68],
    solution: "kldwakpharhrz3bwcfo0hwdvlr3gjkh"
},
{
    template: [
        "##### ###############",
        "IM .# #T . . . . . T#",
        "### # ####### #######",
        "  #.#   #. T#.#      ",
        "  # ##### ### #####  ",
        "  #. . . .# #. . T#  ",
        "  # ##### # # #####  ",
        "  #. T#. .# #.#      ",
        "  ##### ##### # ###  ",
        "      #P . . .# #T#  ",
        "  ##### ##### ### #  ",
        "  #. . .#   #. . .#  ",
        "  # ### ####### ###  ",
        "  #T# #. . . T#.#    ",
        "  ### ######### #    ",
        "            #T M#    ",
        "            #####    ",
    ],
    grades: [81, 85, 89, 110],
    solution: "0oelplwz3spdfkcwgapifuevf5jijalia4fye3gey2hlfo"
},
{
    template: [
        "  ###############  ",
        "  #. . . . . . .#  ",
        "####### ##### # ###",
        "#M . .#. . .#.#. .#",
        "#     # ### # # # #",
        "#T . . P .#. . .#.#",
        "#   ### ##### ### #",
        "#. . .#. .#. . .#.I",
        "####### ##### ### #",
        "  #. . . . . . .#M#",
        "  ########### ### #",
        "            #. . .#",
        "            #######",
    ],
    grades: [102, 107, 120, 145],
    solution: "obwegbwgd4i505jwtbchcmitkbiwovunjsfbingipbi0340403cuf5ci"
},
{
    template: [
        "#-#################",
        "#M#. . . . . . . .#",
        "# #     #######   #",
        "#.#. . .#T . M . .#",
        "# # #   # #####   #",
        "#. .#. . . . .#. .#",
        "# ### ### ##### ###",
        "#. . .#. . .#. . .#",
        "#     ###   #     #",
        "#. . P . . . . . .#",
        "# #####   # ##### #",
        "#. . . . .#. . . .#",
        "# #####   # ###   #",
        "#. . .#. . .#. . .#",
        "# ### ###   ### # #",
        "#. . . .gB . . .#.#",
        "###################",
    ],
    grades: [85, 89, 97, 111],
    solution: "aaidrxghp3lt05mclmch3sz5epehahwzhszbcbkpef3i5ixm"
},
{
    template: [
        "#############-#",
        "#M . . . . .#.#",
        "##### # ### # #",
        "#. .#.#.#. .#T#",
        "# # # ##### # #",
        "#.#. . .#.#.#T#",
        "# ### # # # # #",
        "#. . .#. . .#T#",
        "### ### # # # #",
        "#. .#. .#.#.#T#",
        "# ### ##### # #",
        "#. . . . . P .#",
        "# #######     #",
        "#M . . . . . .#",
        "###############",
    ],
    grades: [35, 38, 43, 51],
    solution: "idggmkdnd1au05wed4kuc5j"
},
{
    template: [
        "#############",
        "#. . . . . .#",
        "# ######### #",
        "#. .#. .#. .#",
        "# ###   # ###",
        "#. . . . . .#",
        "# ####### ###",
        "I.#. . . . .#",
        "### ###     #",
        "#. M#.#. P .#",
        "# ### ##### #",
        "#T M . . . .#",
        "#############",
    ],
    grades: [94, 98, 108, 140],
    solution: "ibiervkhi5hb0gcierhz5wcthhkieglz3vo5pkllrhhhdzox5t1c"
},
{
    template: [
        "        #############-#        ",
        "        #. . . . . .#.#        ",
        "    #####   ### ### # #####    ",
        "    #. . . .#. . .#. . . .#    ",
        "##### #######   ######### #####",
        "#. . .#. . . . . . . .#.#. . .#",
        "# #   # ###     #   ### ##### #",
        "#.#. .#.#. . . .g. . . .#. . .#",
        "# ### ### #   ###     ### #####",
        "#. B#.#.#.#. . . . . .#.#.#. .#",
        "# ### # ### # ###     # # # # #",
        "#.#. .#. . .#.#. . T M .#. .#.#",
        "# #   ####### ############### #",
        "#. . . . .#. .#. . . .#. . . .#",
        "#####     ##### ###   #   #####",
        "    #. . . . .#. .#. . . P#    ",
        "    #####   # ### #   #####    ",
        "        #. .#. . .#. .#        ",
        "        ###############        ",
    ],
    grades: [188, 195, 225, 280],
    solution: "ehiuifibd2hrhowlrqvd3w0yp3lcpmghiwezkbeemewhezevflwurpwbaw020ndgmeibdueuekicogjl3rlbalmmbneeh3zmwm1"
},
{
    template: [
        "    ###########  ",
        "    #. . . . .#  ",
        "##### #####   #  ",
        "#. T#.#. . . .#  ",
        "#   # ###     ###",
        "#. . .#. . P . .I",
        "#   ###   ### ###",
        "#. . M . .#T .#  ",
        "### # # # #   #  ",
        "#. .#.#.#.#. .#  ",
        "#   ####### ###  ",
        "#. M . . . M#    ",
        "#############    ",
    ],
    grades: [83, 89, 100, 136],
    solution: "ibdpaijme1oscchloapn5mlwddiemhwhjzobf2wld111ejx"
},
{
    template: [
        "    ###################    ",
        "    #. . . . M . . . .#    ",
        "    # ############### #####",
        "    #.#. . . . .g. .#. . B#",
        "    # # ### ####### # #####",
        "    #.#.#. . . . .#. .#    ",
        "    # # # ##### ╗ # # #    ",
        "    #.#. .#. . .#. .#.#    ",
        "    # # # # ### # # # #    ",
        "    #. .#.#PGT#.#.#.#.#    ",
        "    # # # # ### # # # #    ",
        "    #.#.#.#. . .#.#.#.#    ",
        "    # # # ╚ ##### # # #    ",
        "    #.#.#. . . . .#.#.#    ",
        "##### # ### ####### # #    ",
        "I. .g. . . . . . . .#.#    ",
        "############# ###g### #    ",
        "    #. M . . . . . . .#    ",
        "    ###################    ",
    ],
    grades: [169, 175, 200, 240],
    solution: "homjfmikn4zvynlhiac13o55cbigdhez3m0dfpiiplcnjo0b0biibhel3m0bokgdpxd1cp0thcljeacndse5twdwk5"
},
{
    template: [
        "#################",
        "#. . .#.#. . . .#",
        "# # ### # ##### #",
        "#.#.#T#.#. .#.#T#",
        "# # # # # # # # #",
        "#.#. . .#.#. . .#",
        "# #     # ### ###",
        "#.#. . .#. . .#.#",
        "# ### ##### ### #",
        "#. . . .#. . M .#",
        "# ##### # ##### #",
        "#. . . . .#. . .#",
        "# ####### # # ###",
        "#. . . . . .#T M#",
        "#   ### # ###   #",
        "IP . . .#. . . .#",
        "#################",
    ],
    grades: [69, 73, 81, 115],
    solution: "icheihv0jmivd3uljhlzdjazeluulaoadztxe1ry"
},
{
    template: [
        "#####################",
        "#. . . . . . . . M .#",
        "### ##### ### ### ###",
        "#P .#. . . . . .#. M#",
        "# # #   #     ##### #",
        "#.#.#. .#. . .#. . .#",
        "# # # ### ### #   # #",
        "#.#. . . . .#. . .#.I",
        "# ### # #   #     # #",
        "#. T .#.#. . . . . .#",
        "###   # # ### ### ###",
        "#. . . .#. . .#. . .#",
        "# ##### # ### # #   #",
        "#.#. . . .#. .#.#. .#",
        "# ### ### # # # ### #",
        "#. . . . . .#. . .#.#",
        "#####################",
    ],
    grades: [76, 80, 92, 106],
    solution: "a3mcewwhd4lqi5mmrbd1b2nukneeimugmmibyl3knkl"
},
{
    template: [
        "###################            ",
        "#. . . . .#. . . .#            ",
        "###   #   #   ### #   #-#######",
        "#. . .#. . . .#. .#   #T T T T#",
        "#   ##### ### ### #   #       #",
        "#. . . .#. . . . .#   #T T T T#",
        "#       #       # #   ##### ###",
        "#. . . P . . . .#.#       #M#  ",
        "### ###       # ###   #####G#  ",
        "#M#. .#. . . .#. .#   #. . .#  ",
        "# #   # ###   # # #   # #####  ",
        "#. . . . . . B .#.#   #.#      ",
        "###########     ###   # #      ",
        "          #. . . .#   #.#      ",
        "          ###G######### #      ",
        "            #.g.G. . . .#      ",
        "            #############      ",
    ],
    grades: [130, 136, 160, 200],
    solution: "y5fidnx13wizplmcoqiklserjhllmxuzh4cuoftgplgjkzyblchcebu13mi2lcodbkmjlo"
},
{
    template: [
        "###########-#########",
        "#. . . . . . M#T .#B#",
        "# ####### ### #   # #",
        "#. .#. . .#.#.#. . .#",
        "#   #     # # ##### #",
        "#. . . P . .#.#. .#.#",
        "# ### ######### ### #",
        "#. T#. . . .G. . . .#",
        "# ### ###   #   ### #",
        "#. . . .#. .#. . . .#",
        "# ##### ####### # ###",
        "#. . .#.#. .#. .#. .#",
        "### # ### # # # ### #",
        "#T .#. . .#. .#. . .#",
        "#####################",
    ],
    grades: [148, 154, 182, 220],
    solution: "pgdwtemimrltogiipihbdp0bamodpbwz33ivobppjmvih3l2lnpglecndwa5cgopbavbpti205sxczi"
},
{
    template: [
        "  ###################        ",
        "  #. .G. . .G. . . .#        ",
        "### #####g######### #        ",
        "#T .#. B . .#. . B#.#        ",
        "#   #       # ##### #        ",
        "#. .#. . . P .#.#. .#        ",
        "#######     ### #g###        ",
        "  #T .#. B .g. . .G.#        ",
        "  #   #   ###G# ### #######  ",
        "  #M .g. .G.#.#.#. .#.#. T#  ",
        "  ######### # # #   # #   #  ",
        "    #T .#. .#.GB#. .G.#. .#  ",
        "    #   #   ###g###g# #G###  ",
        "    #. .g. . .#.#B .#B .#    ",
        "    #########g# #   #########",
        "          #. . .G. .G. .g. .I",
        "          ###################",
    ],
    grades: [158, 166, 180, 220],
    solution: "ylmumhfojzezippimxlimtduyliglvmip5crc2owrvcldte5eghwrvwnizjvd2thapjiavdznncptvwb0mfi"
},
{
    template: [
        "#########################",
        "#T . .#. . . . . . . . .#",
        "##### ### #   ###   ### #",
        "#. . . . .#. .g. . .#. .#",
        "# ###   # #   #G#   # ###",
        "#.#. . .#.#. . .#. .#.#M#",
        "# # ### # #   ### # # # #",
        "#M#. . .#. . . . .#. . .#",
        "# ### # # ### ### ###   #",
        "#. . .G. . . P#. . . . .#",
        "#     # ###   # # ###   #",
        "#. . .#. .#. . .#. . . .#",
        "# ### #   #   ###   ### #",
        "#. .g.#. .#. . . . .#T#.#",
        "# ### # ###   ###g### #g#",
        "#. . . B . . .#.G.#. . .#",
        "###############-#########",
    ],
    grades: [139, 145, 170, 205],
    solution: "ildurihbpszbhfdciave3ykdipoemjcmjveyzoegdgiodyov0bwedfhb4wevolwhdvczhfc252w"
}
];

const glyph = {
    player: "☻",
    monster: "⚉",
    exits: "I-",
    treasure: "♦",
    spot: ".",
    button: "*",
    baseWall: "#",
    walls: "╬║═╝═╚═╩║║╗╣╔╠╦╬"
}
const brightness = {
    level: 10,
    player: 15,
    monster: 12,
    treasure: 16,
    gateOpen: 2,
    gateClosed: 17,
    button: 14,
    title: 11,
    message: 12,
    inactiveMessage: 1,
    box: 9
}
const explosion = [
    { duration: 2, symbol: '?', brightness: 14 },
    { duration: 2, symbol: '&', brightness: 14 },
    { duration: 2, symbol: '#', brightness: 14 },
    { duration: 2, symbol: '%', brightness: 14 },
]

function getName()
{
    return "Monster Maze";
}

function onConnect()
{
    savegame = loadData();
    if (savegame) {
        stats = JSON.parse(savegame);
        if (!stats.version || stats.version != SAVEGAME_VERSION) {
            resetSavegame();
        }
    } else {
        resetSavegame();
    }
    loadLevel();
}

function resetSavegame()
{
    stats = { version: SAVEGAME_VERSION, currentLevel: 0, maxLevel: 0, best: [] }
    for (let i=0; i<levels.length; ++i) stats.best.push("");
    save();
}

function save() {
    saveData(JSON.stringify(stats));
}

function loadLevel() {
    screen = SCREEN_GAME;
    gameWon = false;
    gameOver = false;
    if (stats.currentLevel >= levels.length) {
        stats.currentLevel -= 1;
        gameOver = true;
        messages = [
            " With your pockets full of ",
            "  diamonds you close the   ",
            "  final door behind you... ",
            "                           ",
            "   You have completed the  ",
            "    ultimate adventure:    ",
            "     The MONSTER MAZE!     "
        ];
    }
    save();
    moves = "";
    moveDelay = 0;
    undoCounter = 0;
    undoSteps = [];
    replay = "";
    replayDelay = 0;
    level = levels[stats.currentLevel];
    level.height = level.template.length;
    level.width = level.template[0].length;
    level.x = PLAYAREA_X + Math.floor((PLAYAREA_WIDTH - level.width) / 2);
    level.y = PLAYAREA_Y + Math.floor((PLAYAREA_HEIGHT - level.height) / 2);
    lastMove = { x: 0, y: 0 };
    monsters = [];
    treasures = [];
    gates = [];
    buttons = [];
    animations = [];
    player = { x: 1, y : 1 };
    level.data = [];
    gatesOpen = false;
    for (let y=0; y<level.height; ++y) {
        let line = "";
        for (let x=0; x<level.width; ++x) {
            let symbol = level.template[y][x];
            if (symbol == 'M') {
                monsters.push({ x: x, y: y, dead: false });
                symbol = glyph.spot;
            } else if (symbol == 'P') {
                player = { x: x, y: y };
                symbol = glyph.spot;
            } else if (symbol == 'T') {
                treasures.push({ x: x, y: y });
                symbol = glyph.spot;
            } else if (symbol == 'B') {
                buttons.push({ x: x, y: y });
                symbol = 'B';
            } else if (glyph.walls.indexOf(symbol) >= 0) {
                // keep symbol
            } else if (is_wall(symbol) || symbol == 'G' || symbol == 'g') {
                let index = 0;
                if (y > 0 && is_wall_or_exit(level.template[y-1][x])) index += 1;
                if (x > 0 && is_wall_or_exit(level.template[y][x-1])) index += 2;
                if (x + 1 < level.width && is_wall_or_exit(level.template[y][x+1])) index += 4;
                if (y + 1 < level.height && is_wall_or_exit(level.template[y+1][x])) index += 8;
                if (symbol == 'G' || symbol == 'g') {
                    gates.push({ x: x, y: y, symbol: glyph.walls[index], inverse: symbol == 'g' });
                } else {
                    symbol = glyph.walls[index];
                }
            }
            line = line + symbol;
        }
        level.data.push(line);
    }
}

function onUpdate()
{
    clearScreen();

    if (screen == SCREEN_STATS) {
        drawBox(brightness.box, 1, 0, 54, 20);
        drawText("Level Moves Grade      Level Moves Grade", brightness.message, 6, 1);
        for (let i=0; i<14; ++i) {
            drawText(right3(i + 1), brightness.message, 7, 3 + i);
            drawText(right3(stats.best[i]), brightness.message, 13, 3 + i);
            drawText(grade(stats.best[i], levels[i].grades), brightness.message, 20, 3 + i);
            if (i + 14 < levels.length) {
                drawText(right3(i + 15), brightness.message, 30, 3 + i);
                drawText(right3(stats.best[i + 14]), brightness.message, 36, 3 + i);
                drawText(grade(stats.best[i + 14], levels[i + 14].grades), brightness.message, 43, 3 + i);
            }
        }
        drawText("A: Best known solution, S: Better than lvl author", brightness.message, 3, 18);
        return;
    }

    // Help
    drawBox(brightness.box, TUTORIAL_X, TUTORIAL_Y, TUTORIAL_WIDTH, TUTORIAL_HEIGHT);
    drawText("Brave adventurer,", brightness.message, TUTORIAL_X + 1, TUTORIAL_Y + 1)
    drawText("collect all", brightness.message, TUTORIAL_X + 1, TUTORIAL_Y + 2)
    drawText("diamonds (" + glyph.treasure + ") and", brightness.message, TUTORIAL_X + 1, TUTORIAL_Y + 3)
    drawText("escape through the", brightness.message, TUTORIAL_X + 1, TUTORIAL_Y + 4)
    drawText("door. Monsters (" + glyph.monster + ")", brightness.message, TUTORIAL_X + 1, TUTORIAL_Y + 5)
    drawText("move 2 spaces each", brightness.message, TUTORIAL_X + 1, TUTORIAL_Y + 6)
    drawText("turn after you.", brightness.message, TUTORIAL_X + 1, TUTORIAL_Y + 7)
    drawText("They only come", brightness.message, TUTORIAL_X + 1, TUTORIAL_Y + 8)
    drawText("closer to you and", brightness.message, TUTORIAL_X + 1, TUTORIAL_Y + 9)
    drawText("prefer horizontal", brightness.message, TUTORIAL_X + 1, TUTORIAL_Y + 10)
    drawText("moves. Buttons (" + glyph.button + ")", brightness.message, TUTORIAL_X + 1, TUTORIAL_Y + 11)
    drawText("flip gates (═══).", brightness.message, TUTORIAL_X + 1, TUTORIAL_Y + 12)
    drawText("═", gatesOpen ? brightness.gateOpen : brightness.gateClosed, TUTORIAL_X + 14, TUTORIAL_Y + 12)
    drawText("", brightness.message, TUTORIAL_X + 1, TUTORIAL_Y + 14)
    drawText("Arrow keys: Move", brightness.message, TUTORIAL_X + 1, TUTORIAL_Y + 14)
    drawText("Space: Wait a turn", brightness.message, TUTORIAL_X + 1, TUTORIAL_Y + 15)
    drawText("R: Reset", moves.length > 0 ? brightness.message : brightness.inactiveMessage, TUTORIAL_X + 1, TUTORIAL_Y + 16)
    drawText("U: Undo", moves.length > 0 ? brightness.message : brightness.inactiveMessage, TUTORIAL_X + 11, TUTORIAL_Y + 16)
    drawText("P: Prev", stats.currentLevel > 0 ? brightness.message : brightness.inactiveMessage, TUTORIAL_X + 1, TUTORIAL_Y + 17)
    drawText("N: Next", stats.currentLevel == stats.maxLevel ? brightness.inactiveMessage : brightness.message, TUTORIAL_X + 11, TUTORIAL_Y + 17)
    drawText("X: Replay", stats.best[stats.currentLevel].length ? brightness.message : brightness.inactiveMessage, TUTORIAL_X + 1, TUTORIAL_Y + 18)
    drawText("S: Stats", brightness.message, TUTORIAL_X + 11, TUTORIAL_Y + 18)

    // Level
    for (let y=0; y<level.height; ++y) {
        drawText(level.data[y], brightness.level, level.x, level.y + y);
    }

    // Undos
    while (undoCounter > 0 && undoCounter == undoSteps[undoSteps.length - 1][0]) {
        const undoStep = undoSteps.pop();
        if (undoStep[1] == "player") {
            player.x = undoStep[2];
            player.y = undoStep[3];
        } else if (undoStep[1] == "treasure") {
            treasures.push({ x: player.x, y: player.y });
        } else if (undoStep[1] == "gates") {
            gatesOpen = !gatesOpen;
        } else if (undoStep[1] == "monster") {
            const i = undoStep[2];
            monsters[i].x = undoStep[3];
            monsters[i].y = undoStep[4];
            monsters[i].dead = false;
        } else if (undoStep[1] == "end") {
            moves = moves.substring(0, moves.length - 1);
            undoCounter = 0;
        } else if (undoStep[1] == "fastforward") {
            undoCounter = undoStep[2];
        }
    }
    if (undoCounter > 0) ++undoCounter;

    // Treasures
    for (let i=0; i<treasures.length; ++i) {
        if (treasures[i].x == player.x && treasures[i].y == player.y) {
            undoSteps.push([moveDelay, "treasure"]);
            treasures.splice(i, 1);
            --i;
        } else {
            drawText(glyph.treasure, brightness.treasure, level.x + treasures[i].x, level.y + treasures[i].y);
        }
    }

    // Gates
    for (let i=0; i<gates.length; ++i) {
        const isOpen = gatesOpen ^ gates[i].inverse;
        drawText(gates[i].symbol, isOpen ? brightness.gateOpen : brightness.gateClosed, level.x + gates[i].x, level.y + gates[i].y);
    }

    // Buttons
    for (let i=0; i<buttons.length; ++i) {
        drawText(glyph.button, brightness.button, level.x + buttons[i].x, level.y + buttons[i].y);
    }

    // Player
    if (moveDelay > 0) --moveDelay;
    if (moveDelay == WALK_AT && (lastMove.x != 0 || lastMove.y != 0)) {
        undoSteps.push([moveDelay, "player", player.x, player.y]);
        player.x += lastMove.x;
        player.y += lastMove.y;
        lastMove.x = lastMove.y = 0;
        if (level.data[player.y][player.x] == 'B') {
            undoSteps.push([moveDelay, "gates"]);
            gatesOpen = !gatesOpen;
        }
    }

    // Monsters
    const simulate = SIMULATE_AT.indexOf(moveDelay) >= 0;
    const halfstep = HALFSTEP_AT.indexOf(moveDelay) >= 0;
    const prowling = halfstep || PROWL_AT.indexOf(moveDelay) >= 0;
    let anyMonsterMoved = false;

    for (let i=0; i<monsters.length; ++i) {
        if (monsters[i].dead) continue;
        if ((simulate || prowling) && !gameOver) {
            if (prowling) undoSteps.push([moveDelay, "monster", i, monsters[i].x, monsters[i].y]);
            const dx = player.x > monsters[i].x ? 1 : -1;
            const dy = player.y > monsters[i].y ? 1 : -1;
            const isHalfstepX = monsters[i].x % 2 == 0;
            const isHalfstepY = monsters[i].y % 2 == 0;
            let moved = false;
            if (isHalfstepX || (!halfstep && monsters[i].x != player.x && is_walkable(level.data[monsters[i].y][monsters[i].x + dx]))) {
                if (!simulate) monsters[i].x += dx;
                moved = anyMonsterMoved = true;
            } else if (isHalfstepY || (!halfstep && monsters[i].y != player.y && is_walkable(level.data[monsters[i].y + dy][monsters[i].x]))) {
                if (!simulate) monsters[i].y += dy;
                moved = anyMonsterMoved = true;
            }
            // Monsters killing each other and pressing buttons
            if (prowling) {
                for (let j=0; j<i; ++j) {
                    if (!monsters[j].dead && monsters[i].y == monsters[j].y && monsters[i].x == monsters[j].x) {
                        monsters[i].dead = true;
                        create_animation(explosion, monsters[i].x, monsters[i].y);
                        break;
                    }
                }
                if (moved && !monsters[i].dead && level.data[monsters[i].y][monsters[i].x] == 'B') {
                    undoSteps.push([moveDelay, "gates"]);
                    gatesOpen = !gatesOpen;
                }
            }
        }
        if (undoCounter <= 0 && (monsters[i].x == player.x && monsters[i].y == player.y)) {
            gameOver = true;
            messages = [" You were eaten by a grue! "];
        }
        drawText(glyph.monster, brightness.monster, level.x + monsters[i].x, level.y + monsters[i].y);
    }

    if (simulate && !anyMonsterMoved) {
        if (moves[moves.length - 1] == '♦' && moveDelay == SIMULATE_AT[0] && undoSteps[undoSteps.length - 1][1] == "end") {
            // Don't add a move if waiting and no monster moves
            undoSteps.pop();
            moves = moves.substring(0, moves.length - 1);
        } else {
            undoSteps.push([1, "fastforward", moveDelay]);
        }
        moveDelay = 0;
    }

    // Animations
    for (let i=0; i<animations.length; ++i) {
        const anim = animations[i];
        drawText(anim.keys[anim.key].symbol, anim.keys[anim.key].brightness, level.x + anim.x, level.y + anim.y);
        if (--anim.counter <= 0) {
            ++anim.key;
            if (anim.key >= anim.keys.length) {
                animations.splice(i, 1);
                --i;
                continue;
            }
            anim.counter = anim.keys[anim.key].duration;
        }
    }

    // Player / Game End Message
    if (gameOver || gameWon) {
        let width = messages[0].length;
        let height = messages.length;
        let x = PLAYAREA_X + Math.floor((PLAYAREA_WIDTH - width) / 2);
        let y = PLAYAREA_Y + Math.floor((PLAYAREA_HEIGHT - height) / 2);
        drawBox(brightness.box, x - 1, y - 1, width + 2, height + 2);
        for (let i=0; i<messages.length; ++i) drawText(messages[i], brightness.message, x, y + i);
    } else {
        drawText(glyph.player, brightness.player, level.x + player.x, level.y + player.y);
    }

    // Replays
    if (replay.length) {
        drawBox(brightness.box, PLAYAREA_X + PLAYAREA_WIDTH - 3, PLAYAREA_Y, 3, 3);
        if (replayBlink) drawText("R", brightness.message, PLAYAREA_X + PLAYAREA_WIDTH - 2, PLAYAREA_Y + 1);
        if (--replayDelay <= 0) {
            replayDelay = REPLAY_DELAY;
            replayBlink = !replayBlink;
            onPlayerMove(replay[0]);
            replay = replay.substring(1);
        }
    }

    // Info Bar
    const title = "Level " + format_level(stats.currentLevel + 1) + "  Moves " + left3(moves.length) + "  Best " + left3(stats.best[stats.currentLevel]);
    drawText(title, brightness.title, 0, 0);
}

function onInput(key)
{
    if (key == 115 || key == 83) { // S
        screen = screen == SCREEN_GAME ? SCREEN_STATS : SCREEN_GAME;
        cheatBuffer = "";
        return;
    }
    if (screen == SCREEN_STATS) {
        if (is_continue(key)) {
            screen = SCREEN_GAME;
            // Cheats
            if (cheatBuffer === "mummymaze") {
                stats.maxLevel = levels.length;
            } else if (cheatBuffer === "forgetmenot") {
                resetSavegame();
                loadLevel();
            } else {
                const info = levels[stats.currentLevel];
                if (cheatBuffer.length && info.grades.length && info.solution) {
                    solution = decrypt_solution(info.solution, cheatBuffer, info.grades[0]);
                    if (solution.length) {
                        loadLevel();
                        replay = solution;
                        replayDelay = REPLAY_START_DELAY;
                    }
                }
            }
        } else if (cheatBuffer.length < 20 && (is_letter(key) || is_number(key))) {
            cheatBuffer += String.fromCharCode(key);
        }
        return;
    }

    if (key == 110 || key == 78) { // N
        if (stats.currentLevel < stats.maxLevel) {
            stats.currentLevel += 1;
            loadLevel();
        }
        return;
    }
    if (key == 112 || key == 80) { // P
        if (stats.currentLevel > 0) {
            stats.currentLevel -= 1;
            loadLevel();
        }
        return;
    }
    if (key == 114 || key == 82) { // R
        loadLevel();
        return;
    }
    if (key == 120 || key == 88) { // X
        if (stats.best[stats.currentLevel].length) {
            loadLevel();
            replay = stats.best[stats.currentLevel];
            replayDelay = REPLAY_START_DELAY;
            return;
        }
    }
    if (key == 117 || key == 85) { // U
        if (!gameWon && undoCounter <= 0 && moveDelay <= 0 && moves.length > 0) {
            undoCounter = 1;
            gameOver = false;
            return;
        }
    }

    if (gameWon || gameOver) {
        if (is_continue(key)) {
            if (gameWon) stats.currentLevel += 1;
            loadLevel();
        }
        return;
    }

    if (replay.length > 0) {
        if (key == 10 || key == 27) replay = ""; // Enter or Escape
        return; // No control during replays
    }

    // No control during monster moves or undos
    if (moveDelay > 0 || undoCounter > 0) return;

    if (key == 17) onPlayerMove('▲'); // Up
    if (key == 18) onPlayerMove('▼'); // Down
    if (key == 19) onPlayerMove('<'); // Left
    if (key == 20) onPlayerMove('>'); // Right
    if (key == 32) onPlayerMove('♦'); // Space
}

function onPlayerMove(direction) {
    let target = 'Z';

    if (direction == '▲')  { // Up
        target = level.data[player.y - 1][player.x];
        lastMove.y = -1;
    } else if (direction == '▼') { // Down
        target = level.data[player.y + 1][player.x];
        lastMove.y = 1;
    } else if (direction == '<') { // Left
        target = level.data[player.y][player.x - 1];
        lastMove.x = -1;
    } else if (direction == '>') { // Right
        target = level.data[player.y][player.x + 1];
        lastMove.x = 1;
    }

    if (is_walkable(target)) {
        moveDelay = MOVE_DELAY;
        undoSteps.push([moveDelay, "end"], [moveDelay, "player", player.x, player.y]);
        player.x += lastMove.x;
        player.y += lastMove.y;
        moves += direction;
    } else {
        lastMove.x = lastMove.y = 0;
    }

    if (direction == '♦') { // Space
        moveDelay = SIMULATE_AT[0] + 1; // Faster monster move on skip
        undoSteps.push([moveDelay, "end"]);
        moves += direction;
    }

    if (is_exit(target)) {
        if (treasures.length == 0) {
            gameWon = true;
            if (stats.best[stats.currentLevel].length == 0 || moves.length < stats.best[stats.currentLevel].length) {
                stats.best[stats.currentLevel] = moves;
            }
            messages = ["    You escaped     ", " with the treasure! "];
            if (stats.currentLevel == stats.maxLevel) stats.maxLevel += 1;
            save();
        } else {
            gameOver = true;
            messages = ["     You ran away      ", " without the treasure! "];
        }
    }
}

function is_continue(key) { // Space, Enter or Escape
    return key == 32 || key == 10 || key == 27;
}

function is_letter(key) {
    return (key >= 65 && key <= 90) || (key >= 97 && key <= 122);
}

function is_number(key) {
    return key >= 48 && key <= 57;
}

function is_wall_or_exit(symbol) {
    return is_exit(symbol) || is_wall(symbol) || symbol == 'G' || symbol == 'g';
}

function is_wall(symbol) {
    return symbol == glyph.baseWall || glyph.walls.indexOf(symbol) >= 0;
}

function is_exit(symbol) {
    return glyph.exits.indexOf(symbol) >= 0;
}

function is_walkable(symbol) {
    return symbol == ' ' || (gatesOpen && symbol == 'G') || (!gatesOpen && symbol == 'g');
}

function format_level(number) {
    let str = number + "/" + levels.length;
    if (number < 10) return str + " ";
    return str;
}

function left3(number) {
    if (typeof number === "string") number = number.length > 0 ? number.length : 1000;
    if (number < 10) return number + "  ";
    if (number < 100) return number + " ";
    if (number < 1000) return number;
    return "-  ";
}

function right3(number) {
    if (typeof number === "string") number = number.length > 0 ? number.length : 1000;
    if (number < 10) return "  " + number;
    if (number < 100) return " " + number;
    if (number < 1000) return number;
    return "  -";
}

function grade(moves, grades) {
    if (moves.length == 0 || moves.length > 999) return "-";
    if (grades.length >= 4 && moves.length > grades[3]) return "F";
    if (grades.length >= 3 && moves.length > grades[2]) return "D";
    if (grades.length >= 2 && moves.length > grades[1]) return "C";
    if (grades.length >= 1 && moves.length > grades[0]) return "B";
    if (grades.length >= 1 && moves.length < grades[0]) return "S";
    return "A";
}

function create_animation(keys, x, y) {
    animations.push({ x: x, y: y, keys: keys, key: 0, counter: keys[0].duration })
}

function encrypt_solution(solution, cryptkey) {
    if (solution.length <= 2) return "";
    cryptkey = shrink_key(cryptkey, Math.ceil(solution.length / 2));
    let output = "";
    let checksum = 0;
    for (let index = 0; (index << 1) < solution.length; ++index) {
        const first = MOVE_SYMBOLS.indexOf(solution[index << 1]);
        const second = (index << 1) + 1 < solution.length ? MOVE_SYMBOLS.indexOf(solution[(index << 1) + 1]) : 5;
        const byte = first + second * 5;
        checksum = (37 * checksum + byte) & ((1 << 25) - 1);
        const cryptByte = CRYPT_SYMBOLS.indexOf(cryptkey[index % cryptkey.length]) ^ byte;
        output += CRYPT_SYMBOLS[cryptByte];
    }
    return output += num_to_crypt(checksum, 5);
}

function decrypt_solution(encrypted, cryptkey, expected_length) {
    if (encrypted.length <= 6) return "";
    cryptkey = shrink_key(cryptkey, encrypted.length - 5);
    let output = "";
    let checksum = 0;
    for (let index = 0; index < encrypted.length - 5; ++index) {
        const cryptByte = CRYPT_SYMBOLS.indexOf(encrypted[index]);
        const byte = CRYPT_SYMBOLS.indexOf(cryptkey[index % cryptkey.length]) ^ cryptByte;
        checksum = (37 * checksum + byte) & ((1 << 25) - 1);
        const first = byte % 5;
        const second = Math.floor(byte / 5);
        output += MOVE_SYMBOLS[first];
        if (second < 5) output += MOVE_SYMBOLS[second];
    }
    if (output.length !== expected_length || num_to_crypt(checksum, 5) !== encrypted.substring(encrypted.length - 5, encrypted.length)) {
        return "";
    }
    return output;
}

function shrink_key(cryptkey, length) {
    let index = 0;
    while (cryptkey.length > length) {
        const mod = CRYPT_SYMBOLS[CRYPT_SYMBOLS.indexOf(cryptkey[index]) ^ CRYPT_SYMBOLS.indexOf(cryptkey[cryptkey.length - 1])];
        cryptkey = cryptkey.substring(0, index) + mod + cryptkey.substring(index + 1, cryptkey.length - 1);
        if (++index >= cryptkey.length - 1) index = 0;
    }
    return cryptkey;
}

function num_to_crypt(number, length) {
    let output = "";
    while (--length >= 0) {
        output += CRYPT_SYMBOLS[number % 32];
        number = Math.floor(number / 32);
    }
    return output;
}

