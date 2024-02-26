PLAYAREA_WIDTH = 35
PLAYAREA_HEIGHT = 20
PLAYAREA_X = 0
PLAYAREA_Y = 1
TUTORIAL_X = 36
TUTORIAL_Y = 0
TUTORIAL_WIDTH = 20
TUTORIAL_HEIGHT = 20

SCREEN_GAME = 1
SCREEN_STATS = 2

MOVE_DELAY = 13
SIMULATE_AT = [12, 7]
PROWL_AT = [8, 1]

let screen;
let stats;
let moves;
let moveDelay;
let monsters;
let treasures;
let gates;
let buttons;
let player;
let level;
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
    grades: [8, 9, 10, 12]
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
    grades: [20, 22, 26, 32]
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
    grades: [16, 17, 20, 24]
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
    grades: [28, 32, 36, 50]
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
    grades: [35, 39, 50, 80]
},
{
    template: [
        "#####-#######",
        "#.#. M .#T .#",
        "# #   ##### #",
        "#. . . . .#.#",
        "# ######### #",
        "#. . . . . .#",
        "#   #     ###",
        "#P .#. . . .#",
        "# ####### # #",
        "#.#T . .#.#.#",
        "# ##### ### #",
        "#. . . . . .#",
        "#############",
    ],
    grades: [54, 58, 64, 76]
},
{
    template: [
        "  ###################  ",
        "  #. . . . . . . . .#  ",
        "###   ###       ### ###",
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
    grades: [44, 48, 54, 64]
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
    grades: [34, 36, 42, 60]
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
    grades: [94, 98, 108, 140]
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
    grades: [82, 88, 100, 140]
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
    grades: [81, 85, 89, 110]
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
    grades: [26, 27, 30, 40]
},
{
    template: [
        "#################",
        "#.#. T .#. M . .#",
        "# # ### ###   ###",
        "#. . . . . . . .#",
        "# #####   ###   #",
        "#. .#. B .#P . .#",
        "#   #   # # # ###",
        "#. . . .#. .#. .#",
        "# # # ###   # ###",
        "#.#.#. . . . .#.#",
        "# ### ####### # #",
        "#.#. .#. .#.G. .#",
        "# # ### # # ### #",
        "#T#.#. .#.#. . .#",
        "### # ### #   ###",
        "I. . . .#. . . .#",
        "#################",
    ],
    grades: [101, 105, 113, 140]
},
{
    template: [
        "        ###############        ",
        "        #. . . . . . .#        ",
        "    #####   ### ###   #####    ",
        "    #. . . .#. . .#. . . .#    ",
        "##### #######   ######### #####",
        "#. . .#. . . . . . . .#.#. . .#",
        "# #   # ###     #   ### ##### #",
        "#.#. .#.#. . . .g. . . .#. . .#",
        "# ### ### #   ###     ### #####",
        "#. B#.#.#.#. . . . . .#.#.#. .#",
        "# ### # ### # ###     # # # # #",
        "#.#. .#. . .#.#. T . M .#. .#.#",
        "# #   ####### ############### #",
        "#. . . . .#. .#. . . .#. . . .#",
        "#####     ##### ###   #   #####",
        "    #. . . . .#. .#. . . P#    ",
        "    #####   # ### #   ###-#    ",
        "        #. .#. . .#. .#        ",
        "        ###############        ",
    ],
    grades: [203, 210, 235, 300]
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
        "# ###     ### #",
        "#M . . . . . .#",
        "###############",
    ],
    grades: [36, 39, 43, 51]
},
{
    template: [
        "###############  ",
        "#. . . .#T . .#  ",
        "# # ### ##### ###",
        "#.#. .#. . .G. .#",
        "# # # # ####### #",
        "#. .#. .#.#.#. .#",
        "# ### #         #",
        "#. . .G. . . . .#",
        "#   # #     #   #",
        "#. .#. . . P#. .#",
        "# ###     ### # #",
        "#.#. . . .#. .#.#",
        "# # ### ### # ###",
        "IM . .#B . .#.#T#",
        "### ###     # # #",
        "#T . . . . . .gM#",
        "#################",
    ],
    grades: [109, 115, 123, 150]
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
        "            #.g. . . . .#      ",
        "            #############      ",
    ],
    grades: [140, 146, 168, 200]
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
    grades: [69, 73, 81, 115]
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
    grades: [148, 154, 182, 220]
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
    grades: [83, 89, 100, 136]
},
{
    template: [
        "  ###################        ",
        "  #. .G. . .G. . . B#        ",
        "### #####g####### ###        ",
        "#T .#. B . .#. .#.#          ",
        "#   #       # ### #          ",
        "#. .#. . . P .#.#.#          ",
        "#######     ### #g###        ",
        "  #T .#. B .g. . .G.#        ",
        "  #   #   ###G# ### #######  ",
        "  #M .g. .G.#.#.#. .#.#. T#  ",
        "  ######### # # #   # #   #  ",
        "    #T .#. .#.GB#. .GB#. .#  ",
        "    #   #   ###g###g# #G###  ",
        "    #. .g. . .#.#B .#. .#    ",
        "    #########g# #   #########",
        "          #. . .G. .G. .g. .I",
        "          ###################",
    ],
    grades: [162, 170, 190, 220]
},
{
    template: [
        "###########-#############",
        "#T . .#. . . . . . . . .#",
        "##### ###   #     ##### #",
        "#. . . . . .#. . . .#.#M#",
        "# ###     # # ###   # # #",
        "#.#. . . .#. . .#. . .#.#",
        "# # ### # #   ### # ### #",
        "#.#. . .#. . P . .#. . .#",
        "# #   # # ### #   ###   #",
        "#M#. .#. . . .#. . . . .#",
        "# ### # #     # # ###   #",
        "#. . .#.#. . . .#. . . .#",
        "# ### # ###   ###   ### #",
        "#. .g.#. .#. . . . .#T#.#",
        "# ### # ###   ### ### # #",
        "#. . . B . . .#. .#. . .#",
        "#########################",
    ],
    grades: [130, 136, 160, 200]
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

function getName()
{
    return "Monster Maze";
}

function onConnect()
{
    savegame = loadData();
    if (savegame) {
        stats = JSON.parse(savegame);
    } else {
        resetSavegame();
    }
    loadLevel();
}

function resetSavegame()
{
    stats = { currentLevel: 0, maxLevel: 0, best: [] }
    for (let i=0; i<levels.length; ++i) stats.best.push(1000);
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
    moves = 0;
    moveDelay = 0;
    level = levels[stats.currentLevel];
    level.height = level.template.length;
    level.width = level.template[0].length;
    level.x = PLAYAREA_X + Math.floor((PLAYAREA_WIDTH - level.width) / 2);
    level.y = PLAYAREA_Y + Math.floor((PLAYAREA_HEIGHT - level.height) / 2);
    monsters = [];
    treasures = [];
    gates = [];
    buttons = [];
    player = { x: 1, y : 1 };
    level.data = [];
    gatesOpen = false;
    for (let y=0; y<level.height; ++y) {
        let line = "";
        for (let x=0; x<level.width; ++x) {
            let symbol = level.template[y][x];
            if (symbol == 'M') {
                monsters.push({ x: x, y: y, prowl: 0 });
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
    drawText("escape through", brightness.message, TUTORIAL_X + 1, TUTORIAL_Y + 4)
    drawText("the door.", brightness.message, TUTORIAL_X + 1, TUTORIAL_Y + 5)
    drawText("Monsters (" + glyph.monster + ") move", brightness.message, TUTORIAL_X + 1, TUTORIAL_Y + 6)
    drawText("2 spaces after", brightness.message, TUTORIAL_X + 1, TUTORIAL_Y + 7)
    drawText("you move. They", brightness.message, TUTORIAL_X + 1, TUTORIAL_Y + 8)
    drawText("only move closer", brightness.message, TUTORIAL_X + 1, TUTORIAL_Y + 9)
    drawText("to you and prefer", brightness.message, TUTORIAL_X + 1, TUTORIAL_Y + 10)
    drawText("horizontal moves.", brightness.message, TUTORIAL_X + 1, TUTORIAL_Y + 11)
    drawText("Buttons (" + glyph.button + ") toggle", brightness.message, TUTORIAL_X + 1, TUTORIAL_Y + 12)
    drawText("gates (═══).", brightness.message, TUTORIAL_X + 1, TUTORIAL_Y + 13)
    drawText("═", gatesOpen ? brightness.gateOpen : brightness.gateClosed, TUTORIAL_X + 9, TUTORIAL_Y + 13)
    drawText("", brightness.message, TUTORIAL_X + 1, TUTORIAL_Y + 14)
    drawText("Arrow keys: Move", brightness.message, TUTORIAL_X + 1, TUTORIAL_Y + 15)
    drawText("Space: Wait a turn", brightness.message, TUTORIAL_X + 1, TUTORIAL_Y + 16)
    drawText("R: Reset", moves > 0 ? brightness.message : brightness.inactiveMessage, TUTORIAL_X + 1, TUTORIAL_Y + 17)
    drawText("S: Stats", brightness.message, TUTORIAL_X + 11, TUTORIAL_Y + 17)
    drawText("P: Prev", stats.currentLevel > 0 ? brightness.message : brightness.inactiveMessage, TUTORIAL_X + 1, TUTORIAL_Y + 18)
    drawText("N: Next", stats.currentLevel == stats.maxLevel ? brightness.inactiveMessage : brightness.message, TUTORIAL_X + 11, TUTORIAL_Y + 18)

    // Level
    const title = "Level " + format_level(stats.currentLevel + 1) + "  Moves " + left3(moves) + "  Best " + left3(stats.best[stats.currentLevel]);
    drawText(title, brightness.title, 0, 0);
    for (let y=0; y<level.height; ++y) {
        drawText(level.data[y], brightness.level, level.x, level.y + y);
    }

    // Treasures
    for (let i=0; i<treasures.length; ++i) {
        if (treasures[i].x == player.x && treasures[i].y == player.y) {
            treasures[i] = treasures[treasures.length - 1];
            treasures.pop();
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

    // Monsters
    --moveDelay;
    const simulate = SIMULATE_AT.indexOf(moveDelay) >= 0;
    const prowling = PROWL_AT.indexOf(moveDelay) >= 0;
    let prowled = false;
    let buttons_hit = 0;

    for (let i=0; i<monsters.length; ++i) {
        if ((simulate || prowling) && !gameOver) {
            let dx = player.x > monsters[i].x ? 1 : -1;
            let dy = player.y > monsters[i].y ? 1 : -1;
            let moved = false;
            if (monsters[i].x != player.x && is_walkable(level.data[monsters[i].y][monsters[i].x + dx])) {
                if (!simulate) monsters[i].x += dx * 2;
                prowled = moved = true;
            } else if (monsters[i].y != player.y && is_walkable(level.data[monsters[i].y + dy][monsters[i].x])) {
                if (!simulate) monsters[i].y += dy * 2;
                prowled = moved = true;
            }
            if (!simulate && moved && level.data[monsters[i].y][monsters[i].x] == 'B') ++buttons_hit;
        }
        if (monsters[i].x == player.x && monsters[i].y == player.y) {
            gameOver = true;
            messages = [" You were eaten by a grue! "];
        }
        drawText(glyph.monster, brightness.monster, level.x + monsters[i].x, level.y + monsters[i].y);
    }
    if (buttons_hit % 2 == 1) gatesOpen = !gatesOpen;
    if (simulate && !prowled) moveDelay = 0;

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
}

function onInput(key)
{
    if (key == 115 || key == 83) { // S
        screen = screen == SCREEN_GAME ? SCREEN_STATS : SCREEN_GAME;
        cheatBuffer = "";
        return;
    }
    if (screen == SCREEN_STATS) {
        if (is_continue(key)) screen = SCREEN_GAME;
        if (key == 120 || key == 121 || key == 122) {
            cheatBuffer += String.fromCharCode(key);
            if (cheatBuffer.length > 5) cheatBuffer = cheatBuffer.substring(cheatBuffer.length - 5, cheatBuffer.length);
            if (cheatBuffer === "xyzzy") stats.maxLevel = levels.length;
            if (cheatBuffer === "yxxzx") {
                resetSavegame();
                loadLevel();
            }
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
    if (gameWon || gameOver) {
        if (is_continue(key)) {
            if (gameWon) stats.currentLevel += 1;
            loadLevel();
        }
        return;
    }

    if (moveDelay > 0) return;

    let target = 'Z';
    if (key == 17) { // Up
        target = level.data[player.y - 1][player.x];
        if (is_walkable(target)) {
            player.y -= 2;
            moveDelay = MOVE_DELAY;
            ++moves;
        }
    } else if (key == 18) { // Down
        target = level.data[player.y + 1][player.x];
        if (is_walkable(target)) {
            player.y += 2;
            moveDelay = MOVE_DELAY;
            ++moves;
        }
    } else if (key == 19) { // Left
        target = level.data[player.y][player.x - 1];
        if (is_walkable(target)) {
            player.x -= 2;
            moveDelay = MOVE_DELAY;
            ++moves;
        }
    } else if (key == 20) { // Right
        target = level.data[player.y][player.x + 1];
        if (is_walkable(target)) {
            player.x += 2;
            moveDelay = MOVE_DELAY;
            ++moves;
        }
    } else if (key == 32) { // Space
        moveDelay = MOVE_DELAY;
        ++moves;
    }
    if (is_exit(target)) {
        if (treasures.length == 0) {
            gameWon = true;
            stats.best[stats.currentLevel] = Math.min(stats.best[stats.currentLevel], moves);
            messages = ["    You escaped     ", " with the treasure! "];
            if (stats.currentLevel == stats.maxLevel) stats.maxLevel += 1;
            save();
        } else {
            gameOver = true;
            messages = ["     You ran away      ", " without the treasure! "];
        }
    }
    if (is_walkable(target) && level.data[player.y][player.x] == 'B') gatesOpen = !gatesOpen;
    if (player.x < 0 || player.y < 0 || player.x >= level.width || player.y >= level.height) gameWon = true;
}

function is_continue(key) {
    return key == 32 || key == 10 || key == 27;
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
    if (number < 10) return number + "  ";
    if (number < 100) return number + " ";
    if (number < 1000) return number;
    return "-  ";
}

function right3(number) {
    if (number < 10) return "  " + number;
    if (number < 100) return " " + number;
    if (number < 1000) return number;
    return "  -";
}

function grade(moves, grades) {
    if (moves > 999) return "-";
    if (grades.length >= 4 && moves > grades[3]) return "F";
    if (grades.length >= 3 && moves > grades[2]) return "D";
    if (grades.length >= 2 && moves > grades[1]) return "C";
    if (grades.length >= 1 && moves > grades[0]) return "B";
    if (grades.length >= 1 && moves < grades[0]) return "S";
    return "A";
}
