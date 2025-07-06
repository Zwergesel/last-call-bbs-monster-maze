PLAYAREA_WIDTH = 35;
PLAYAREA_HEIGHT = 20;
PLAYAREA_X = 0;
PLAYAREA_Y = 1;
TUTORIAL_X = 36;
TUTORIAL_Y = 0;
TUTORIAL_WIDTH = 20;
TUTORIAL_HEIGHT = 20;

SAVEGAME_VERSION = 12;

SCREEN_GAME = 1;
SCREEN_STATS = 2;

REPLAY_START_DELAY = 30;
REPLAY_DELAY = 15;
MOVE_DELAY = 14;
WALK_AT = 12;
PROWL_AT = [10, 4];
HALFSTEP_AT = [7, 1];
SIMULATE_AT = [11, 6];

MOVE_SYMBOLS = "^v<>x";
CRYPT_SYMBOLS = "abcdefghijklmnopqrstuvwxyz012345";

let mobileUiState = "disabled"; // disabled, help, controls
let screen;
let stats;
let moves;
let moveDelay;
let lastMove;
let undoCounter;
let undoSteps;
let undoUsed = 0;
let resetUsed = 0;
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

const levels = [
{
    id: "tutorial",
    template: [
        "  you       a monster",
        "   v             v   ",
        "  #################  ",
        "  #P . . . . . . M#  ",
        "  ### ####### #####  ",
        "    #.#     #.#      ",
        "    # ##### # ###    ",
        "    #T T T# #. .#    ",
        "    ##### # ### ###  ",
        "     ^  #.#   #. .#  ",
        "   ;ems # ##### ###  ",
        "        #. . T T T#  ",
        "        ######### #  ",
        "     exit > I. . .#  ",
        "            #######  ",
    ],
    grades: [14, 16, 18],
    solution: "tvs10pigtoei"
},
{
    id: "lonely",
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
    grades: [8, 10, 12],
    solution: "un2zm0rsa"
},
{
    id: "windmill",
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
    grades: [20, 22, 24],
    solution: "jhieriwneoyabqo"
},
{
    id: "trap",
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
    grades: [16, 18, 20],
    solution: "txwhshlz2nsgm"
},
{
    id: "guardian",
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
    grades: [27, 29, 33],
    solution: "iicpgvdzbp0tluxmq5s"
},
{
    id: "cramped",
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
    grades: [35, 37, 41],
    solution: "ylimpfoohozbiooii45kcmo"
},
{
    id: "swing",
    template: [
        "#####-#######",
        "#T . . . . .#",
        "### ### # ###",
        "#. .#. .#. M#",
        "# # # # ### #",
        "#.#.#.#. . T#",
        "# ### ##### #",
        "#. . P . . .#",
        "#############",
    ],
    grades: [37, 39, 45],
    solution: "enhpfvwif1ayfbieawy0f5bv"
},
{
    id: "button",
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
    grades: [26, 28, 30],
    solution: "o5hllxvdfse5inbjbf"
},
{
    id: "backdoor",
    template: [
        "###########",
        "#. . . . P#",
        "# #####   #",
        "#. B#. . .#",
        "#   # ### #",
        "#. .g. T .#",
        "### #     #",
        "  #.#. . M#",
        "  # ### ###",
        "  I.#. .#  ",
        "  # ### #  ",
        "  #. . .#  ",
        "  #######  ",
    ],
    grades: [45, 47, 51],
    solution: "ebucfvilp204zfdwgnoh5ysgnbxe"
},
{
    id: "meadow",
    template: [
        "#################  ",
        "#. . . . . . . .#  ",
        "# # ###     #   ###",
        "#.#. T#. . .#. . T#",
        "# ### #     ###   #",
        "#. . . . . . . . .#",
        "# #   ######### # #",
        "#.#. .#. . . .#.#.#",
        "# ### ##### ### # #",
        "#.#. . .#. .#. . .#",
        "# #     # ### ### #",
        "#. . . . T . . . T#",
        "### ###         # #",
        "  #. . . . . P .#M#",
        "  ###########-#####",
    ],
    grades: [40, 44, 54],
    solution: "epoojhmgam0dflppsvjam0ugq"
},
{
    id: "wait",
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
    grades: [40, 42, 46],
    solution: "1bpifxuo33cwagkijhle42tsy"
},
{
    id: "emptiness",
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
    grades: [34, 36, 38],
    solution: "ymgejlsz3wovepdgdc44dx"
},
{
    id: "twins",
    template: [
        "#######-###",
        "#. . M . .#",
        "###   #   #",
        "#.#. .#. .#",
        "# # ##### #",
        "#. .#. . M#",
        "# # ###   #",
        "#.#. . . T#",
        "### ### ###",
        "#. .#. . .#",
        "#   ##### #",
        "#P . . . .#",
        "###########",
    ],
    grades: [44, 48, 66],
    solution: "55kgdhwh4mysokmiskglpm0vd3v"
},
{
    id: "stonewall",
    template: [
        "###########",
        "#M . T . .#",
        "# ##### # #",
        "#.#. . .#T#",
        "# # # ### #",
        "#.#.#.#. .I",
        "# # # #   #",
        "#.#.#. . P#",
        "# # ##### #",
        "#. T . . .#",
        "###########",
    ],
    grades: [39, 42, 49],
    solution: "endcshlnm3osenhvibhxaa122"
},
{
    id: "bait",
    template: [
        "#########    ",
        "#. . . .#    ",
        "# ### # ###  ",
        "#. T#.#. .#  ",
        "# ### # # ###",
        "#. . .#P#M#MI",
        "# ### # # # #",
        "#.#. . .#.#.#",
        "# ###   ### #",
        "#. . . . . .#",
        "#############",
    ],
    grades: [36, 40, 46],
    solution: "dhdfmkgnpth4zfcurhxxpbz"
},
{
    id: "locksmith",
    template: [
        "  ###########  ",
        "  #. PG. . .#  ",
        "  # ##### ###  ",
        "  #.#B .#.#.#  ",
        "### # ### # ###",
        "I. . . .#T . .#",
        "### ### # # ###",
        "  #.#. . .#.#  ",
        "  ##### ### #  ",
        "  #. . . . M#  ",
        "  ###########  ",
    ],
    grades: [46, 50, 54],
    solution: "p3bgmvjhionrn3bblepbazetgyg5"
},
{
    id: "distraction",
    template: [
        "###############",
        "#. . . . . . .#",
        "##### ##### ###",
        "I. .#. .#. .#.#",
        "# ###   # ### #",
        "#. . . P . . .#",
        "### #####   # #",
        "#. . . M#. .#.#",
        "# ### # # # # #",
        "#T T#.#.#.#. .#",
        "#   ### # ### #",
        "#T T . . . . .#",
        "###############",
    ],
    grades: [44, 48, 58],
    solution: "afmodfhgdzdda3jibfclm2kcgpt"
},
{
    id: "stuck",
    template: [
        "###########-#######",
        "#. . . . . . . . .#",
        "# #   ### #   ### #",
        "#.#. .#. .#. . . .#",
        "# #   # # # # ### #",
        "#. . . .#. .#. .#M#",
        "# ##### # # # # # #",
        "#. .#.#. .#. .#. .#",
        "# # # #   # # ### #",
        "#.#.#. . . T#. . M#",
        "### ############# #",
        "#. P . . . . . . .#",
        "###################",
    ],
    grades: [32, 34, 36],
    solution: "ipectbsz3m0zkkeexj1hl"
},
{
    id: "sesame",
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
    grades: [48, 51, 58],
    solution: "pfcponibp1yvabxwrhflnsf5pes3m"
},
{
    id: "insight",
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
    grades: [35, 38, 45],
    solution: "idggmkdnd1au05wed4kuc5j"
},
{
    id: "triplets",
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
    grades: [83, 85, 93],
    solution: "ibdpaijme1oscchloapn5mlwddiemhwhjzobf2wld111ejx"
},
{
    id: "vast",
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
    grades: [82, 86, 94],
    solution: "ebxwreen3yy3ebogbnel3j0bonwcimun5qe5cpicr513km"
},
{
    id: "lure",
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
    grades: [58, 60, 66],
    solution: "d3wmfqgldz0vibbdlvi0frc2hfhhpncg3n"
},
{
    id: "toggle",
    template: [
        "###############  ",
        "#. T T#T T . M#  ",
        "# #   # # ### #  ",
        "#.#. . .#. . .#  ",
        "# # ##### #G#####",
        "#.#.#. .#.#. . .#",
        "# ##### ### ### #",
        "#. .g. B . .#. .#",
        "### #     # ### #",
        "#. .#. . .#.#. .#",
        "# ### # ##### # #",
        "#P#. .#. . . .#.I",
        "#################",
    ],
    grades: [67, 73, 95],
    solution: "hcwhmcdzjzec0cbdpfgmircth3jbapmzjeu5mwe"
},
{
    id: "hadrian",
    template: [
        "###############",
        "#. . . . . . T#",
        "#   ### # #####",
        "#. .#. .#. . .#",
        "# ###   #     #",
        "#. . . .#. . .#",
        "# ###   # ### #",
        "#. .#. .#. M#.#",
        "### # # ##### #",
        "#. . .#. . .#.#",
        "#   ###     # #",
        "#. .#.#. . .#.#",
        "# ### # ### # #",
        "#. . . . P . .#",
        "#########-#####",
    ],
    grades: [78, 82, 90],
    solution: "knoidbw1jo0tihgutbch32crpkdeafez3meuolutzg2a"
},
{
    id: "caves",
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
    grades: [81, 85, 91],
    solution: "0oelplwz3spdfkcwgapifuevf5jijalia4fye3gey2hlfo"
},
{
    id: "mole",
    template: [
        "#############",
        "I. . . . .#.#",
        "# ### ### # #",
        "#P .#. .#. .#",
        "# ##### ### #",
        "#. . . . . .#",
        "# ### ### # #",
        "#.#. . . .#.#",
        "### # ### # #",
        "#T#.#.#. .#.#",
        "# ### # ### #",
        "#. M . . . .#",
        "#############",
    ],
    grades: [51, 55, 59],
    solution: "yfwpceogfuz1akcirlbzm3czcwsl4za"
},
{
    id: "reunion",
    template: [
        "#############    ",
        "I. . . . . .#    ",
        "# ##### ### ###  ",
        "#. . .#. .#M .#  ",
        "##### ### ### #  ",
        "  #. . . P   .#  ",
        "  # ###   ### #  ",
        "  #.#. . . . .#  ",
        "  # ### ### #####",
        "  #. . .#. .#M .#",
        "  ### ##### #   #",
        "    #. . . . . T#",
        "    #############",
    ],
    grades: [76, 84, 100],
    solution: "dgfhmkibnoauy3jgbioj3t04e5mmibwhd2k2cp1onk1"
},
{
    id: "escape",
    template: [
        "#########-###############",
        "#. . . . . . . . . . .GM#",
        "# ### ###       ##### ###",
        "#. .#.#.#. B . . . .#. .#",
        "### # # #         # ### #",
        "#M#. .#. . . . P .#. .#M#",
        "# # ###     #     # # # #",
        "#. .#. . . .#. T . .#. .#",
        "# # # ### ###   ### # ###",
        "#.#. . . . . . . .#. . .#",
        "# # # #######   # # ### #",
        "#.#.#.#. . . . .#. . .#.#",
        "# ### #   # ### # # ### #",
        "#. . . . M#. . . .#. M .#",
        "#########################",
    ],
    grades: [7, 8, 9],
    solution: "zbqsu2bca"
},
{
    id: "bouncer",
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
    grades: [51, 53, 59],
    solution: "kldwakpharhrz3bwcfo0hwdvlr3gjkh"
},
{
    id: "distance",
    template: [
        "  #######################  ",
        "  I. . . . . . . . . . .#  ",
        "### # # ### ##### ### # ###",
        "#. .#.#. .#T T T . . .#. .#",
        "# # ### # # # ### # ### # #",
        "#P#.#. .#. T#T T .#. .#.#M#",
        "# # # ### # # # ### # # # #",
        "#. .#.#. .#T T#T . .#.#. .#",
        "### # # ### ### ##### # ###",
        "  #. . . . . . . . . . .#  ",
        "  #######################  ",
    ],
    grades: [44, 48, 58],
    solution: "hicrail15ryqa3eeelijdsta3jv"
},
{
    id: "castle",
    template: [
        "### ### ### ### ### ###",
        "#T# #M# #T# #T# #M# #T#",
        "# ### ### # # ### ### #",
        "#. . . . .# #. . . . .#",
        "### ### ### ### #G# ###",
        "  #.#.G.#     #.#.#.#  ",
        "  # # # ####### # # #  ",
        "  #.#.#. . . . .#.#.#  ",
        "  # ### ####### #G# #  ",
        "  #.#.G.#. . .#.#.#.#  ",
        "  # # # # #G# # # # #  ",
        "  #.G.#.#.#B#.#.#.G.#  ",
        "  # ### # # # # ### #  ",
        "  #. . .G.#P#.G. . .#  ",
        "  #########-#########  ",
    ],
    grades: [134, 144, 158],
    solution: "ifugjap0mrad0necfnelczd5khibrvbmjyl2a3goemviawytihbwrcdnjuitfkccbncli250"
},
{
    id: "altar",
    template: [
        "  #############",
        "  #. . . . . .#",
        "  # ##### ### #",
        "  #. . .#.#. .#",
        "### ### # #   #",
        "#. . .#. .g. .#",
        "#     #   # ###",
        "#. T . . . . .I",
        "#     #   ### #",
        "#. . .#. . B .#",
        "### ###   # ###",
        "  #. . P .#. .#",
        "  # ### # ### #",
        "  #. . .#. M .#",
        "  #############",
    ],
    grades: [96, 98, 104],
    solution: "dplebvuda445elbmixhzo3dddpigceoeh3h1dmhoplcn530qcowvd"
},
{
    id: "friends",
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
    grades: [94, 97, 105],
    solution: "ibiervkhi5hb0gcierhz5wcthhkieglz3vo5pkllrhhhdzox5t1c"
},
{
    id: "jigsaw",
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
    grades: [102, 107, 120],
    solution: "obwegbwgd4i505jwtbchcmitkbiwovunjsfbingipbi0340403cuf5ci"
},
{
    id: "pathfinder",
    template: [
        "#################################",
        "#. . T#. T#. .#T#.G.g.G.g.G.g.GM#",
        "# # ### ###g# # # ###############",
        "#.#. .G. . .#. .#. .#         #.#",
        "# ####### ### ##### #         # #",
        "#.#T . . .G.#.g. .#.#         #B#",
        "# ### ### # ##### # #         # #",
        "#. T#.#T .#. .#T .#.#         #M#",
        "# ### ###g### ### # #         # #",
        "#P . .#. .#T . .G.#.#         #.#",
        "# ### # ##### ### # #         # #",
        "#. .#. .G.#. . T .#.#         #B#",
        "### ##### # # ##### ######### # #",
        "#T . .G. . .#. . . . . . . .I #.#",
        "############################# ###",
    ],
    grades: [81, 83, 89],
    solution: "hkwesvmd4mcqecbgeaoeishu0fpmepih3mlbp5ww51hcil"
},
{
    id: "precision",
    template: [
        "###############",
        "#. .#. . M#. T#",
        "# ### ### # ###",
        "#. . . .#. . .#",
        "# ##### ##### #",
        "#.#P . . .#.#.#",
        "# ##### # # # #",
        "#.#. .#.#. .#.#",
        "# ### # ### ###",
        "#.#. . . . . .#",
        "### #   # ### #",
        "#. .#. .#. .#.I",
        "# # # # # ### #",
        "#.#. .#. . . .#",
        "###   # ##### #",
        "#. . . . . . .#",
        "###############",
    ],
    grades: [69, 71, 77],
    solution: "0lcpokiimw01cplojtgz5rp1jhgitbc1cmrjou1g"
},
{
    id: "cross",
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
        "#. . . .#. . . .#",
        "# ##### # ##### #",
        "#. . . . .#. M .#",
        "# # ##### ### ###",
        "IP#. . M#. . .#T#",
        "### ##### ### # #",
        "#T . . . . .#. .#",
        "#################",
    ],
    grades: [120, 128, 150],
    solution: "i5egjkm1m1ouaohgdvj025euofdgbhca3oo4eavwmphaf2krcnvtpbc1jpiutxisz"
},
{
    id: "circle",
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
    grades: [188, 196, 220],
    solution: "ehiuifibd2hrhowlrqvd3w0yp3lcpmghiwezkbeemewhezevflwurpwbaw020ndgmeibdueuekicogjl3rlbalmmbneeh3zmwm1"
},
{
    id: "confusion",
    template: [
        "#####-###########",
        "#. . . . M .#T#M#",
        "# ### #     # # #",
        "#. . .#. . . . .#",
        "### # # ###   # #",
        "#.#.#. .#. . .#.#",
        "# ###   #   ### #",
        "#. . . .#. . .#.#",
        "# #   ### #   ###",
        "#.#. . . .#. . .#",
        "###     # #   # #",
        "#. . . .#. . .#.#",
        "#   #   ### # ###",
        "#. P#. . . .#. T#",
        "# # ### ### #   #",
        "#T#. . . .#. . .#",
        "#################",
    ],
    grades: [65, 67, 71],
    solution: "hbceavmip1pv0lvhbaibp5lte2wwtcghu3voqe"
},
{
    id: "mansion",
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
    grades: [148, 154, 166],
    solution: "pgdwtemimrltogiipihbdp0bamodpbwz33ivobppjmvih3l2lnpglecndwa5cgopbavbpti205sxczi"
},
{
    id: "chambers",
    template: [
        "#############                ",
        "I. . . .#. .#                ",
        "# ### # # # ###########      ",
        "#. .#.#. .#M . . . . .#      ",
        "# ### ### # ######### #      ",
        "#. . .#T .#.#       #.#      ",
        "# #   # ### # ####### #######",
        "#.#. P . . .# #. . . . . . .#",
        "############# ### ##### #####",
        "              #.#. T#. .#. .#",
        "############# # ##### ##### #",
        "#. .#. . .#.# #. . . . . . M#",
        "# ### # ### # ####### #######",
        "#.#. .#. . .#       #.#      ",
        "# # ### ### ######### #      ",
        "#. . . T#. . . . . . .#      ",
        "### ### ### ###########      ",
        "#. . . . . M#                ",
        "#############                ",
    ],
    grades: [131, 133, 140],
    solution: "ckellbwiam0ve3gwlaleczpvicljeachd2eve1wwavwip3k0ilmdpvlbpserpgpej2twiof"
},
{
    id: "deception",
    template: [
        "  #######-#############",
        "  #. . . P . . . . . .#",
        "  # ### # #######   ###",
        "  #. .#.#.#. . . . .#.#",
        "  # ### # #   # ### # #",
        "  #. . .#. . B#.#. . .#",
        "  # ####### # # #   ###",
        "  #. . . . .#. . . .#  ",
        "####### ### # #G### #  ",
        "#T T T#.#.#. .#. .#.#  ",
        "#     # # ##### # # #  ",
        "#T . Tg.#. . . .#. M#  ",
        "#     # #   #   ### #  ",
        "#T T T#. . .#. . . .#  ",
        "#####################  ",
    ],
    grades: [108, 112, 120],
    solution: "oficdvl15oitc2iiemdlkol2ofiirvlemvove2wuofianzet03ewjhosxsl"
},
{
    id: "atlantis",
    template: [
        "    ###################    ",
        "    #. . . . M . . . .#    ",
        "    # ############### #####",
        "    #.#. . . . .g. .#. . B#",
        "    # # ### ####### # #####",
        "    #.#.#. . . . .#. .#    ",
        "    # # # ##### # # # #    ",
        "    #.#. .#. . .#. .#.#    ",
        "    # # # # ### # # # #    ",
        "    #. .#.#PGT#.#.#.#.#    ",
        "    # # # # ### # # # #    ",
        "    #.#.#.#. . .#.#.#.#    ",
        "    # # # # ##### # # #    ",
        "    #.#.#. . . . .#.#.#    ",
        "##### # ### ####### # #    ",
        "I. .g. . . . . . . .#.#    ",
        "############# ###g### #    ",
        "    #. M . . . . . . .#    ",
        "    ###################    ",
    ],
    grades: [169, 175, 185],
    solution: "homjfmikn4zvynlhiac13o55cbigdhez3m0dfpiiplcnjo0b0biibhel3m0bokgdpxd1cp0thcljeacndse5twdwk5"
},
{
    id: "labyrinth",
    template: [
        "###########################",
        "#.#M B . . . .#. . .#M . .#",
        "# ### ##### # # # ##### # #",
        "#.#. .G. .#.#. .#.#. . .#.#",
        "# ### ### ####### # # #####",
        "#. .#.#. . .#. . . .#. . .#",
        "# # # ############# #######",
        "#.#. . . .#M .#. . .#. . .#",
        "### ####### # ### ##### ###",
        "#. .#. .#.#.#T#. . . . .#PI",
        "# ### ### # ### # ####### #",
        "#M . . . .#. . .#.#. .#. .#",
        "# ##### ######### # ### ###",
        "#. .#.#.#. . . . . .#BG. .#",
        "### # ### ####### ### #####",
        "#M#.#. . .#. .#. .#. .#. .#",
        "# # ####### # ####### ### #",
        "#. . .g. . .#. . . . . . .#",
        "###########################",
    ],
    grades: [291, 301, 350],
    solution: "3kdbccfeczd5kkiidflep10dkbcgbcu13siwh5mhlxpnesp50cwhmvijm2cycbdceaun3mhd02hlmcdmeskuebegmiee3wl1ygccdhheczdvdbdiriwifvk2jkuhaegbeueuokdufvwe5ml2husdpys"
},
{
    id: "doubleclick",
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
    grades: [130, 138, 150],
    solution: "y5fidnx13wizplmcoqiklserjhllmxuzh4cuoftgplgjkzyblchcebu13mi2lcodbkmjlo"
},
{
    id: "chase",
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
    grades: [76, 80, 86],
    solution: "a3mcewwhd4lqi5mmrbd1b2nukneeimugmmibyl3knkl"
},
{
    id: "palace",
    template: [
        "  #################          ",
        "  #. .G. . .G. . .#          ",
        "### #####g####### #######    ",
        "#T .#. B . .#. B#. .#. T#    ",
        "#   #       # ##### #   #    ",
        "#. .#. . . . .g. .g.#. .#    ",
        "#######     ###   ###G#g###  ",
        "  #T .#. B Pg. . .G. .#. T#  ",
        "  #   #   ###G# ###   #   #  ",
        "  #M .g. .G.#.#.#. . .#. .#  ",
        "  ######### # # ### ###G#####",
        "    #T .#. .#.GB#.#.g. Bg. .#",
        "    #   #   ###g# #g#   #   #",
        "    #. .g. . .#.#B .#B .#. T#",
        "    #########g# #   #####G###",
        "          I. . .G. .g. . .#  ",
        "          #################  ",
    ],
    grades: [183, 190, 220],
    solution: "0lchacenevkrcnwlnmd1jscd0fhemvedispsibicbawlau0bafooslihe30b0fmdemm1a4ysynlpfngojppb0cdibaiqwrq2i"
},
{
    id: "sixtysix",
    template: [
        "#########   #########   #########",
        "#M . . .#   #. . . .#   #. T . M#",
        "# ### # #####   # ###   #####   #",
        "#. . .#. . . . .#. .#   #. . . .#",
        "# ##### ##### ##### ##### ### # #",
        "IP . . .#   #. . .#M . . . .#.#.#",
        "# ### ###   ###   # #####   # ###",
        "#. . . .#   #. . . .#   #. . . .#",
        "### #####   ##### ###   ##### ###",
        "  #.#           #.#         #.#  ",
        "### #####   ##### ###   ##### ###",
        "#. . . .#   #. .#.#.#   #. .#.#.#",
        "# #######   ### # # ##### ### # #",
        "#.#. T .#   #. . . . . . . . . .#",
        "# ### ######### ### #####   ### #",
        "#T . .#. . . . . .#.#   #. .#T .#",
        "###   # #####   ### #   ### ### #",
        "#. . . M#   #. . . M#   #. . . M#",
        "#########   #########   #########",
    ],
    grades: [251, 261, 301],
    solution: "52moriwehnybfbvwtvdnhvkzekpsrhglzmhbyfcemjghdvoyo4hlrvm0fse5ihxhrpwn5ygrcbidplplepyq05juanel4sc5dmhwavu13rlcolcipap334ktcpidp2kk33x"
},
];

function createArea(x, y, width, height, text, key) {
    return { x: x, y: y, width: width, height: height, text: text, key: key };
}

function inArea(area, x, y) {
    return x >= area.x && x < area.x + area.width && y >= area.y && y < area.y + area.height;
}

const tapAreas = {
    maze: createArea(1, 1, TUTORIAL_X - 2, 18, "", 10),
    replay: createArea(TUTORIAL_X + 1, TUTORIAL_Y, 9, 3, "My Best", 120),
    stats: createArea(TUTORIAL_X + 10, TUTORIAL_Y, 9, 3, " Stats ", 115),
    prev: createArea(TUTORIAL_X + 1, TUTORIAL_Y + 3, 6, 3, "Prev", 112),
    reset: createArea(TUTORIAL_X + 7, TUTORIAL_Y + 3, 6, 3, "Redo", 114),
    next: createArea(TUTORIAL_X + 13, TUTORIAL_Y + 3, 6, 3, "Next", 110),
    up: createArea(TUTORIAL_X + 7, TUTORIAL_Y + 8, 6, 4, " Up ", 17),
    left: createArea(TUTORIAL_X, TUTORIAL_Y + 12, 7, 4, "Left", 19),
    wait: createArea(TUTORIAL_X + 7, TUTORIAL_Y + 12, 6, 4, "Wait", 32),
    right: createArea(TUTORIAL_X + 13, TUTORIAL_Y + 12, 7, 4, "Right", 20),
    down: createArea(TUTORIAL_X + 7, TUTORIAL_Y + 16, 6, 4, "Down", 18),
    undo: createArea(TUTORIAL_X + 14, TUTORIAL_Y + 16, 6, 4, "Undo", 117),
    enable: createArea(TUTORIAL_X + 1, TUTORIAL_Y + 14, 9, 5, ["  Use  ", " touch ", "control"]),
    disable: createArea(TUTORIAL_X + 10, TUTORIAL_Y + 14, 9, 5, ["  Use  ", "  key- ", " board "]),
}
const glyph = {
    player: "☻",
    monster: "⚉",
    exits: { horizontal: "-", vertical: "I" },
    gates: { horizontal: "═", vertical: "║" },
    treasure: "♦",
    spot: { even: ".", odd: "." },
    button: "*",
    buttonName: "button",
    walls: "╬║═╝═╚═╩║║╗╣╔╠╦╬", // 1 = Up, 2 = Left, 4 = Right, 8 = Down
    star: "*",
    blank: ".",
}
const brightness = {
    level: 10,
    spot: 5,
    player: 15,
    monster: 12,
    treasure: 16,
    gateOpen: 2,
    gateClosed: 17,
    button: 14,
    title: 11,
    message: 12,
    inactive: 4,
    box: 9,
    star: 12,
    highlighted: 17
}
const explosion = [
    { duration: 2, symbol: '?', brightness: 14 },
    { duration: 2, symbol: '&', brightness: 14 },
    { duration: 2, symbol: '#', brightness: 14 },
    { duration: 2, symbol: '%', brightness: 14 },
]

const ADJECTIVES = [
    "Academic","Admired","Adorable","Aggressive","Amazing","Amiable","Amused","Anonymous","Anxious","Athletic",
    "Awesome","Awkward","Basic","Beautiful","Bold","Brilliant","Busy","Calm","Careful","Casual","Cautious",
    "Charming","Cheerful","Clever","Clumsy","Colorful","Competitive","Concerned","Confident","Confused",
    "Content","Cool","Courageous","Crazy","Creative","Criminal","Cuddly","Curious","Dangerous","Deaf",
    "Defensive","Delicate","Desperate","Determined","Diplomatic","Dramatic","Drunk","Eager","Efficient",
    "Elderly","Electronic","Energetic","Enormous","Ethical","Evil","Excellent","Excited","Faithful","Familiar",
    "Famous","Fancy","Fantastic","Fashionable","Fast","Fierce","Fluffy","Foolish","Formidable","Friendly",
    "Funny","Generous","Gentle","Giant","Glamorous","Glorious","Graceful","Grim","Handsome","Happy","Healthy",
    "Heavy","Helpful","Hilarious","Honest","Hungry","Important","Impressive","Independent","Injured","Innocent",
    "Intelligent","Invisible","Jolly","Just","Keen","Kind","Large","Lazy","Little","Lonely","Loud","Lovely",
    "Loyal","Lucky","Magic","Married","Marvellous","Massive","Melodic","Mighty","Mobile","Modern","Mysterious",
    "Natural","Nervous","Nice","Noble","Noisy","Odd","Old","Ordinary","Pale","Passive","Patient","Peaceful",
    "Peculiar","Pleasant","Popular","Powerful","Productive","Proud","Puzzled","Quiet","Rapid","Rare","Reasonable",
    "Relaxed","Reliable","Remarkable","Respectable","Responsible","Rich","Ridiculous","Robust","Romantic","Royal",
    "Sad","Satisfied","Scared","Scary","Secret","Sensible","Serious","Shiny","Shy","Silent","Silly","Skilled",
    "Sleepy","Slim","Slow","Small","Strange","Strategic","Striped","Strong","Subtle","Successful","Superb",
    "Supreme","Surprised","Suspicious","Sweet","Swift","Tame","Tiny","Tough","Tragic","Tricky","Ultimate",
    "Uncertain","Unemployed","Unique","Valuable","Vulnerable","Weird","Wild","Worried","Young","Zany"
]
const ANIMALS = [
    "Aardvark","Albatross","Alligator","Alpaca","Ant","Anteater","Antelope","Ape","Armadillo","Baboon","Badger",
    "Barracuda","Bat","Bear","Beaver","Bee","Bison","Boar","Buffalo","Butterfly","Camel","Capybara","Caribou",
    "Cassowary","Cat","Caterpillar","Cheetah","Chicken","Chimpanzee","Chinchilla","Cobra","Cormorant","Coyote",
    "Crab","Crane","Crocodile","Crow","Deer","Dinosaur","Dog","Donkey","Dolphin","Dove","Dragonfly","Duck",
    "Dugong","Eagle","Eel","Elephant","Elk","Emu","Falcon","Ferret","Fish","Flamingo","Fly","Fox","Frog",
    "Gazelle","Giraffe","Gnu","Goat","Goldfish","Goose","Gorilla","Grasshopper","Hamster","Hare","Hawk",
    "Hedgehog","Heron","Herring","Hippopotamus","Hornet","Horse","Hummingbird","Hyena","Jackal","Jaguar",
    "Jellyfish","Kangaroo","Koala","Kookabura","Lemur","Leopard","Lion","Llama","Lobster","Locust","Magpie",
    "Manatee","Mandrill","Mantis","Meerkat","Mole","Mongoose","Monkey","Moose","Mosquito","Mouse","Mule",
    "Narwhal","Newt","Octopus","Opossum","Ostrich","Otter","Owl","Panther","Parrot","Pelican","Penguin","Pig",
    "Pony","Porcupine","Rabbit","Raccoon","Ram","Rat","Raven","Rhinoceros","Salamander","Salmon","Scorpion",
    "Seal","Shark","Sheep","Snail","Snake","Sparrow","Spider","Squid","Squirrel","Stingray","Stork","Swallow",
    "Swan","Tapir","Tiger","Toad","Turkey","Turtle","Viper","Vulture","Walrus","Wasp","Weasel","Whale","Wolf",
    "Wolverine","Wombat","Yak","Zebra"
]

function getName()
{
    return "Monster Maze";
}

function onConnect(initialMobileUiState, replacementGlyphs)
{
    if (!initialMobileUiState) initialMobileUiState = "disabled";
    if (replacementGlyphs) {
        for (let key in replacementGlyphs) {
            glyph[key] = replacementGlyphs[key];
        }
    }

    mobileUiState = initialMobileUiState;
    savegame = loadData();
    if (savegame) {
        stats = JSON.parse(savegame);
        if (!stats.version) {
            resetSavegame();
        }
        if (!stats.player) {
            stats.player = generatePlayerName();
        }
        if (stats.version == 9) {
            migrateSavegame(10, [
                0, 1, 2, 3, 4, 5, -1, 7, 8, 10,
                11, 12, 15, 17, 24, 19, 18, 20, 26, 21,
                22, 30, 25, 31, 28, 29, 32, 33, 34, 35,
                36, 37, 38, 39, 40, 41, 42, 43, 44, 45,
                46, 47
            ]);
        }
        if (stats.version == 10) {
            let mapping = [];
            for (let i=0; i<48; ++i) mapping.push(i);
            mapping[16] = -1;
            migrateSavegame(11, mapping);
        }
        if (stats.version == 11) {
            migrateSavegame(12, [
                0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
                10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
                20, 21, 22, 23, 24, 25, 26, 27, 28, 29,
                30, 31, 32, 33, 34, 35, 36, 37, 38, 39,
                42, 41, 43, 40, 45, 46, 47, 48
            ]);
        }
        if (stats.version != SAVEGAME_VERSION) {
            resetSavegame();
        }
    } else {
        resetSavegame();
    }
    loadLevel();
}

function generatePlayerName() {
    const a = Math.floor(Math.random() * ADJECTIVES.length);
    const b = Math.floor(Math.random() * (ADJECTIVES.length - 1));
    if (a == b) b = ADJECTIVES.length - 1;
    const c = Math.floor(Math.random() * ANIMALS.length);
    return ADJECTIVES[a] + ADJECTIVES[b] + ANIMALS[c];
}

function resetSavegame()
{
    player_name = stats && stats.player || generatePlayerName();
    stats = { player: player_name, version: SAVEGAME_VERSION, currentLevel: 0, maxLevel: 0, best: [] }
    while (stats.best.length < levels.length) stats.best.push("");
    save();
}

function migrateSavegame(toVersion, migrationMap) {
    let newBest = [];
    while (newBest.length < levels.length) newBest.push("");
    for (let i=0; i<stats.best.length; ++i) {
        newPos = migrationMap[i];
        if (newPos >= 0) {
            newBest[newPos] = stats.best[i];
        }
    }

    let firstUnsolvedLevel = levels.length - 1;
    let lastSolvedLevel = 0;
    for (let i=0; i<newBest.length; ++i) {
        if (newBest[i].length > 0) {
            lastSolvedLevel = i;
        } else if (i < firstUnsolvedLevel) {
            firstUnsolvedLevel = i;
        }
    }

    stats = { player: stats.player, version: toVersion, currentLevel: firstUnsolvedLevel, maxLevel: lastSolvedLevel + 1, best: newBest }
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
            "  treasure you close the   ",
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
                symbol = '.';
            } else if (symbol == 'P') {
                player = { x: x, y: y };
                symbol = '.';
            } else if (symbol == 'T') {
                treasures.push({ x: x, y: y });
                symbol = '.';
            } else if (symbol == 'B') {
                buttons.push({ x: x, y: y });
                symbol = 'B';
            } else if (symbol == '.') {
                symbol = '.';
            } else if (symbol == ';') {
                symbol = 'g';
            } else if (symbol == 'I') {
                symbol = glyph.exits.vertical;
            } else if (symbol == '-') {
                symbol = glyph.exits.horizontal;
            } else if (is_wall(symbol) || symbol == 'G' || symbol == 'g') {
                let index = 0;
                if (y > 0 && is_wall_or_exit(level.template[y-1][x])) index += 1;
                if (x > 0 && is_wall_or_exit(level.template[y][x-1])) index += 2;
                if (x + 1 < level.width && is_wall_or_exit(level.template[y][x+1])) index += 4;
                if (y + 1 < level.height && is_wall_or_exit(level.template[y+1][x])) index += 8;
                if (symbol == 'G' || symbol == 'g') {
                    gate_glyph = index == 6 ? glyph.gates.horizontal : glyph.gates.vertical;
                    gates.push({ x: x, y: y, symbol: gate_glyph, inverse: symbol == 'g' });
                } else {
                    symbol = glyph.walls[index];
                }
            }
            line = line + symbol;
        }
        level.data.push(line);
    }
}

function drawTapArea(area, active) {
    if (active === undefined) active = true;
    drawBox(active ? brightness.box : brightness.inactive, area.x, area.y, area.width, area.height);
    if (Array.isArray(area.text)) {
        for (let i = 0; i < area.text.length; ++i) {
            drawText(area.text[i], active ? brightness.message : brightness.inactive, area.x + 1, area.y + 1 + i);
        }
    } else {
        drawText(area.text, active ? brightness.message : brightness.inactive, area.x + 1, area.y + area.height/2);
    }
}

function onUpdate()
{
    clearScreen();

    if (screen == SCREEN_STATS) {
        drawBox(brightness.box, 1, 0, 54, 20);
        drawText("Lvl Mov Rank      Lvl Mov Rank      Lvl Mov Rank", brightness.message, 4, 1);
        for (let i=1; i<=16; ++i) {
            if (i < levels.length) {
                drawText(right3(i), brightness.message, 3, 2 + i);
                drawText(right3(stats.best[i]), brightness.message, 8, 2 + i);
                draw_stars(stats.best[i], levels[i].grades, 13, 2 + i);
            }
            if (i + 16 < levels.length) {
                drawText(right3(i + 16), brightness.message, 21, 2 + i);
                drawText(right3(stats.best[i + 16]), brightness.message, 26, 2 + i);
                draw_stars(stats.best[i + 16], levels[i + 16].grades, 31, 2 + i);
            }
            if (i + 32 < levels.length) {
                drawText(right3(i + 32), brightness.message, 39, 2 + i);
                drawText(right3(stats.best[i + 32]), brightness.message, 44, 2 + i);
                draw_stars(stats.best[i + 32], levels[i + 32].grades, 49, 2 + i);
            }
        }
        return;
    }

    if (mobileUiState === "controls") {
        // Mobile UI
        drawTapArea(tapAreas.replay, stats.best[stats.currentLevel].length > 0);
        drawTapArea(tapAreas.stats);
        drawTapArea(tapAreas.prev, stats.currentLevel > 0);
        drawTapArea(tapAreas.reset, moves.length > 0);
        drawTapArea(tapAreas.next, stats.currentLevel < stats.maxLevel);
        drawTapArea(tapAreas.up);
        drawTapArea(tapAreas.left);
        drawTapArea(tapAreas.wait);
        drawTapArea(tapAreas.right);
        drawTapArea(tapAreas.down);
        drawTapArea(tapAreas.undo, moves.length > 0);
    } else {
        // Help screen
        drawBox(brightness.box, TUTORIAL_X, TUTORIAL_Y, TUTORIAL_WIDTH, TUTORIAL_HEIGHT);
        drawText("Brave adventurer, ", brightness.message, TUTORIAL_X + 1, TUTORIAL_Y + 1);
        drawText("grab all gems (?) ", brightness.message, TUTORIAL_X + 1, TUTORIAL_Y + 2);
        drawText("and escape through", brightness.message, TUTORIAL_X + 1, TUTORIAL_Y + 3);
        drawText("the door. Monsters", brightness.message, TUTORIAL_X + 1, TUTORIAL_Y + 4);
        drawText("move up to 2 steps", brightness.message, TUTORIAL_X + 1, TUTORIAL_Y + 5);
        drawText("after your turn.  ", brightness.message, TUTORIAL_X + 1, TUTORIAL_Y + 6);
        drawText("They (?) only move", brightness.message, TUTORIAL_X + 1, TUTORIAL_Y + 7);
        drawText("closer to you and ", brightness.message, TUTORIAL_X + 1, TUTORIAL_Y + 8);
        drawText("prefer horizontal ", stats.currentLevel <= 2 ? brightness.highlighted : brightness.message, TUTORIAL_X + 1, TUTORIAL_Y + 9);
        drawText("moves. Moving on a", brightness.message, TUTORIAL_X + 1, TUTORIAL_Y + 10);
        drawText(glyph.buttonName + " (?) toggles", brightness.message, TUTORIAL_X + 1, TUTORIAL_Y + 11);
        drawText("all gates (???).  ", brightness.message, TUTORIAL_X + 1, TUTORIAL_Y + 12);
        drawText("                  ", brightness.message, TUTORIAL_X + 1, TUTORIAL_Y + 13);
        drawText(glyph.treasure, brightness.treasure, TUTORIAL_X + 16, TUTORIAL_Y + 2);
        drawText(glyph.monster, brightness.monster, TUTORIAL_X + 7, TUTORIAL_Y + 7);
        drawText(glyph.button, brightness.button, TUTORIAL_X + glyph.buttonName.length + 3, TUTORIAL_Y + 11);
        drawText(glyph.walls[6] + glyph.gates.horizontal + glyph.walls[6], brightness.level, TUTORIAL_X + 12, TUTORIAL_Y + 12);
        drawText(glyph.gates.horizontal, gatesOpen ? brightness.gateOpen : brightness.gateClosed, TUTORIAL_X + 13, TUTORIAL_Y + 12);

        if (mobileUiState === "help") {
            drawTapArea(tapAreas.enable);
            drawTapArea(tapAreas.disable);
        } else {
            drawText("Arrow keys: Move  ", brightness.message, TUTORIAL_X + 1, TUTORIAL_Y + 14)
            drawText("Space: Wait a turn", brightness.message, TUTORIAL_X + 1, TUTORIAL_Y + 15)
            drawText("R: Reset", moves.length > 0 ? brightness.message : brightness.inactive, TUTORIAL_X + 1, TUTORIAL_Y + 16)
            drawText("U: Undo", moves.length > 0 ? brightness.message : brightness.inactive, TUTORIAL_X + 11, TUTORIAL_Y + 16)
            drawText("P: Prev", stats.currentLevel > 0 ? brightness.message : brightness.inactive, TUTORIAL_X + 1, TUTORIAL_Y + 17)
            drawText("N: Next", stats.currentLevel == stats.maxLevel ? brightness.inactive : brightness.message, TUTORIAL_X + 11, TUTORIAL_Y + 17)
            drawText("X: Replay", stats.best[stats.currentLevel].length ? brightness.message : brightness.inactive, TUTORIAL_X + 1, TUTORIAL_Y + 18)
            drawText("S: Stats", brightness.message, TUTORIAL_X + 11, TUTORIAL_Y + 18)
        }
    }

    // Level
    for (let y=0; y<level.height; ++y) {
        for (let x=0; x<level.width; ++x) {
            let level_glyph = level.data[y][x];
            let bright = brightness.level;
            if (level_glyph == '.') {
                level_glyph = (x + y) % 4 == 2 ? glyph.spot.odd : glyph.spot.even;
                bright = brightness.spot;
            }
            drawText(level_glyph, bright, level.x + x, level.y + y);
        }
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
            messages = [
                " You were eaten by a grue! ",
                "                           ",
                mobileUiState != "disabled" ?
                " Undo or tap here to reset " :
                "  U: Undo  R/Space: Reset  ",
            ];
        }
        drawText(glyph.monster, brightness.monster, level.x + monsters[i].x, level.y + monsters[i].y);
    }

    if (simulate && !anyMonsterMoved) {
        if (moves[moves.length - 1] == 'x' && moveDelay == SIMULATE_AT[0] && undoSteps[undoSteps.length - 1][1] == "end") {
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
        drawText(replayBlink ? "R" : " ", brightness.message, PLAYAREA_X + PLAYAREA_WIDTH - 2, PLAYAREA_Y + 1);
        if (--replayDelay <= 0) {
            replayDelay = REPLAY_DELAY;
            replayBlink = !replayBlink;
            onPlayerMove(replay[0]);
            replay = replay.substring(1);
        }
    }

    // Info Bar
    const levelNumber = stats.currentLevel == 0 ? "Tutorial " : "Lvl " + format_level(stats.currentLevel);
    const title = levelNumber +
        "  Move " + left3(moves.length) +
        "  Best " + left3(stats.best[stats.currentLevel]) +
        "   " + glyph.treasure + " " + treasures.length;
    drawText(title, brightness.title, 0, 0);
    drawText(glyph.treasure, brightness.treasure, 32, 0)
}

function onTap(x, y) {
    if (mobileUiState === "disabled") {
        return;
    }
    if (screen == SCREEN_STATS) {
        onInput(115);
        return;
    }
    if (mobileUiState === "help") {
        if (inArea(tapAreas.enable, x, y)) mobileUiState = "controls";
        if (inArea(tapAreas.disable, x, y)) mobileUiState = "disabled";
        return;
    }
    for (let key in tapAreas) {
        const area = tapAreas[key];
        if (area.key && inArea(area, x, y)) {
            onInput(area.key);
            return;
        }
    }
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
            } else if (cheatBuffer.substring(0, 7) == "perfect" && cheatBuffer.length > 7) {
                pwd = cheatBuffer.substring(7);
                for (let i=0; i<levels.length; ++i) {
                    solution = decrypt_solution(levels[i].solution, pwd, levels[i].grades[0]);
                    if (solution.length) {
                        stats.best[i] = solution;
                        stats.maxLevel = i + 1;
                    }
                }
                save();
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
            resetUsed = 0;
            undoUsed = 0;
            loadLevel();
        }
        return;
    }
    if (key == 112 || key == 80) { // P
        if (stats.currentLevel > 0) {
            stats.currentLevel -= 1;
            resetUsed = 0;
            undoUsed = 0;
            loadLevel();
        }
        return;
    }
    if (key == 114 || key == 82) { // R
        resetUsed += 1;
        loadLevel();
        return;
    }
    if (key == 120 || key == 88) { // X
        if (replay.length > 0) {
            replay = "";
        } else if (stats.best[stats.currentLevel].length) {
            loadLevel();
            replay = stats.best[stats.currentLevel];
            replayDelay = REPLAY_START_DELAY;
        }
        return;
    }

    if (replay.length > 0) {
        if (key == 10 || key == 27) replay = ""; // Enter or Escape
        return; // No control during replays
    }

    // No control during monster moves or undos
    if (moveDelay > 0 || undoCounter > 0) return;

    if (key == 117 || key == 85) { // U
        if (moves.length > 0) {
            undoCounter = 1;
            undoUsed += 1;
            gameOver = false;
        }
        return;
    }

    if (gameWon || gameOver) {
        if (is_continue(key)) {
            if (gameWon) {
                stats.currentLevel += 1;
                resetUsed = 0;
                undoUsed = 0;
            }
            loadLevel();
        }
        return;
    }

    if (key == 17) onPlayerMove('^'); // Up
    if (key == 18) onPlayerMove('v'); // Down
    if (key == 19) onPlayerMove('<'); // Left
    if (key == 20) onPlayerMove('>'); // Right
    if (key == 32) onPlayerMove('x'); // Space
}

function onPlayerMove(direction) {
    let target = 'Z';

    if (direction == '^')  { // Up
        target = level.data[player.y - 1][player.x];
        lastMove.y = -1;
    } else if (direction == 'v') { // Down
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

    if (direction == 'x') { // Space
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
            ext_level_solved(stats.player, stats.currentLevel, levels[stats.currentLevel].id, moves, resetUsed, undoUsed, SAVEGAME_VERSION);
            resetUsed = 0;
            undoUsed = 0;
        } else {
            gameOver = true;
            messages = [" You did not collect ", "  all the treasure!  "];
        }
    }

    if (moves.length >= 1000) {
        gameOver = true;
        messages = [" You died of exhaustion... "];
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
    return symbol == '#' || glyph.walls.indexOf(symbol) >= 0;
}

function is_exit(symbol) {
    return symbol == 'I' || symbol == '-' || symbol == glyph.exits.horizontal || symbol == glyph.exits.vertical;
}

function is_walkable(symbol) {
    return symbol == ' ' || (gatesOpen && symbol == 'G') || (!gatesOpen && symbol == 'g');
}

function format_level(number) {
    let str = number + "/" + (levels.length - 1);
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
    if (moves.length == 0 || moves.length > 999) return "";
    if (grades.length >= 4 && moves.length > grades[3]) return "D";
    if (grades.length >= 3 && moves.length > grades[2]) return "C";
    if (grades.length >= 2 && moves.length > grades[1]) return "B";
    if (grades.length >= 1 && moves.length > grades[0]) return "A";
    if (grades.length >= 1 && moves.length < grades[0]) return "Y";
    return "S";
}

function draw_stars(moves, grades, x, y) {
    if (moves.length == 0 || moves.length > 999 || (grades.length >= 3 && moves.length > grades[2])) {
        drawText(glyph.blank + glyph.blank + glyph.blank, brightness.inactive, x, y);
    } else if (grades.length >= 2 && moves.length > grades[1]) {
        drawText(glyph.star, brightness.star, x, y);
        drawText(glyph.blank + glyph.blank, brightness.inactive, x + 1, y);
    } else if (grades.length >= 1 && moves.length > grades[0]) {
        drawText(glyph.star + glyph.star, brightness.star, x, y);
        drawText(glyph.blank, brightness.inactive, x + 2, y);
    } else if (grades.length >= 1 && moves.length == grades[0]) {
        drawText(glyph.star + glyph.star + glyph.star, brightness.star, x, y);
    } else {
        drawText("???", brightness.star, x, y);
    }
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

function ext_level_solved(player, index, level_id, moves, resets, undos, version) {}
