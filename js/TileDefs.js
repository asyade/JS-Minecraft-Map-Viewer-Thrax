var tileDefs = {
    //	0x00:{name:"default"		,faces:[13,15,13,15,13,15,13,15,13,15,13,15,],transparent:true},
    0x01: {
        name: "stone",
        faces: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0]
    },
    0x02: {
        name: "grass",
        faces: [3, 0, 3, 0, 0, 0, 2, 0, 3, 0, 3, 0]
    },
    0x03: {
        name: "dirt",
        faces: [2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0]
    },
    0x04: {
        name: "cobblestone",
        faces: [0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0]
    },
    0x05: {
        name: "planks",
        faces: [4, 0, 4, 0, 4, 0, 4, 0, 4, 0, 4, 0]
    },
    0x06: {
        name: "sapling",
        faces: [15, 0, 15, 0, 15, 0, 15, 0, 15, 0, 15, 0],
        transparent: true
    },
    0x07: {
        name: "bedrock",
        faces: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    },
    0x08: {
        name: "flowing_water",
        faces: [3, 4, 3, 4, 3, 4, 3, 4, 3, 4, 3, 4],
        transparent: true
    },
    0x09: {
        name: "water",
        faces: [15, 13, 13, 12, 13, 12, 13, 12, 13, 12, 13, 12],
        transparent: true
    },
    0x0A: {
        name: "flowing_lava",
        faces: [14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14]
    },
    0x0B: {
        name: "lava",
        faces: [15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15]
    },
    0x0C: {
        name: "sand",
        faces: [2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1]
    },
    0x0D: {
        name: "gravel",
        faces: [3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1]
    },

    0x0E: {
        name: "gold_ore",
        faces: [0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2]
    },
    0x0F: {
        name: "iron_ore",
        faces: [1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2]
    },
    0x10: {
        name: "coal_ore",
        faces: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]
    },

    0x11: {
        name: "log",
        faces: [4, 1, 4, 1, 5, 1, 5, 1, 4, 1, 4, 1]
    },
    0x12: {
        name: "leaves",
        faces: [4, 3, 4, 3, 4, 3, 4, 3, 4, 3, 4, 3],
        transparent: true
    },
    0x13: {
        name: "sponge",
        faces: [0, 3, 0, 3, 0, 3, 0, 3, 0, 3, 0, 3]
    },
    0x14: {
        name: "glass",
        faces: [1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3],
        transparent: true
    },

    0x15: {
        name: "lapis_ore",
        faces: [0, 10, 0, 10, 0, 10, 0, 10, 0, 10, 0, 10]
    },
    0x16: {
        name: "lapis_block",
        faces: [0, 9, 0, 9, 0, 9, 0, 9, 0, 9, 0, 9]
    },

    0x17: {
        name: "dispenser",
        faces: [14, 2, 14, 2, 14, 2, 14, 2, 14, 2, 14, 2]
    },

    0x18: {
        name: "sandstone",
        faces: [0, 12, 0, 12, 0, 11, 0, 13, 0, 12, 0, 12]
    },

    0x19: {
        name: "noteblock",
        faces: [10, 4, 10, 4, 10, 4, 10, 4, 10, 4, 10, 4]
    },

    0x1A: {
        name: "bed",
        faces: [10, 4, 10, 4, 10, 4, 10, 4, 10, 4, 10, 4]
    },
    //
    0x1B: {
        name: "golden_rail",
        faces: [10, 4, 10, 4, 10, 4, 10, 4, 10, 4, 10, 4]
    },
    //
    0x1C: {
        name: "detector_rail",
        faces: [10, 4, 10, 4, 10, 4, 10, 4, 10, 4, 10, 4]
    },
    //
    0x1D: {
        name: "sticky_piston",
        faces: [10, 4, 10, 4, 10, 4, 10, 4, 10, 4, 10, 4]
    },
    //

    0x1E: {
        name: "web",
        faces: [11, 0, 11, 0, 11, 0, 11, 0, 11, 0, 11, 0],
        transparent: true
    },

    0x1F: {
        name: "tallgrass",
        faces: [7, 2, 7, 2, 7, 2, 7, 2, 7, 2, 7, 2],
        transparent: true
    },

    0x20: {
        name: "deadbush",
        faces: [8, 3, 8, 3, 8, 3, 8, 3, 8, 3, 8, 3],
        transparent: true
    },
    //

    0x21: {
        name: "piston",
        faces: [12, 6, 12, 6, 11, 6, 13, 6, 12, 6, 12, 6]
    },

    0x22: {
        name: "piston_head",
        faces: [12, 6, 12, 6, 11, 6, 13, 6, 12, 6, 12, 6]
    },

    0x23: {
        name: "wool",
        faces: [1, 14, 1, 14, 1, 14, 1, 14, 1, 14, 1, 14]
    },

    0x24: {
        name: "piston_extension",
        faces: [1, 14, 1, 14, 1, 14, 1, 14, 1, 14, 1, 14]
    },
    //

    0x25: {
        name: "yellow_flower",
        faces: [13, 0, 13, 0, 13, 0, 13, 0, 13, 0, 13, 0],
        transparent: true
    },
    //
    0x26: {
        name: "red_flower",
        faces: [12, 0, 12, 0, 12, 0, 12, 0, 12, 0, 12, 0],
        transparent: true
    },
    //
    0x27: {
        name: "brown_mushroom",
        faces: [13, 1, 13, 1, 13, 1, 13, 1, 13, 1, 13, 1],
        transparent: true
    },
    //
    0x28: {
        name: "red_mushroom",
        faces: [12, 1, 12, 1, 12, 1, 12, 1, 12, 1, 12, 1],
        transparent: true
    },
    //

    0x29: {
        name: "gold_block",
        faces: [7, 1, 7, 1, 7, 1, 7, 1, 7, 1, 7, 1]
    },
    0x2A: {
        name: "iron_block",
        faces: [8, 1, 8, 1, 8, 1, 8, 1, 8, 1, 8, 1]
    },
    0x2B: {
        name: "double_stone_slab",
        faces: [6, 3, 6, 3, 6, 0, 6, 0, 6, 3, 6, 3]
    },
    0x2C: {
        name: "stone_slab",
        faces: [6, 3, 6, 3, 6, 0, 6, 0, 6, 3, 6, 3]
    },
    0x2D: {
        name: "brick_block",
        faces: [7, 0, 7, 0, 7, 0, 7, 0, 7, 0, 7, 0]
    },

    0x2E: {
        name: "tnt",
        faces: [7, 0, 7, 0, 7, 0, 7, 0, 7, 0, 7, 0]
    },
    0x2F: {
        name: "bookshelf",
        faces: [3, 2, 3, 2, 4, 0, 4, 0, 3, 2, 3, 2]
    },

    0x30: {
        name: "mossy_cobblestone",
        faces: [4, 2, 4, 2, 4, 2, 4, 2, 4, 2, 4, 2]
    },
    0x31: {
        name: "obsidian",
        faces: [5, 2, 5, 2, 5, 2, 5, 2, 5, 2, 5, 2]
    },
    0x32: {
        name: "torch",
        faces: [0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5]
    },

    0x33: {
        name: "fire",
        faces: [0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5]
    },
    //?
    0x34: {
        name: "mob_spawner",
        faces: [0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5]
    },
    //?

    0x35: {
        name: "oak_stairs",
        faces: [0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5]
    },
    //?
    0x36: {
        name: "chest",
        faces: [11, 1, 10, 1, 9, 1, 9, 1, 11, 1, 10, 1]
    },

    0x37: {
        name: "restone_wire",
        faces: [10, 4, 10, 4, 10, 4, 10, 4, 10, 4, 10, 4],
        transparent: true
    },

    0x38: {
        name: "diamond_ore",
        faces: [2, 3, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3]
    },
    0x39: {
        name: "diamond_block",
        faces: [8, 1, 8, 1, 8, 1, 8, 1, 8, 1, 8, 1]
    },

    0x3A: {
        name: "crafting_table",
        faces: [11, 3, 12, 3, 11, 2, 4, 0, 11, 3, 12, 3]
    },

    0x3B: {
        name: "wheat",
        faces: [15, 5, 15, 5, 15, 5, 15, 5, 15, 5, 15, 5],
        transparent: true
    },
    0x3C: {
        name: "farmland",
        faces: [7, 5, 7, 5, 6, 5, 7, 5, 7, 5, 7, 5]
    },

    0x3D: {
        name: "furnace",
        faces: [12, 2, 13, 2, 14, 2, 14, 2, 12, 2, 13, 2]
    },

    0x3E: {
        name: "lit_furnace",
        faces: [12, 2, 13, 2, 14, 3, 15, 3, 12, 2, 13, 2]
    },

    0x3F: {
        name: "standing_sign",
        faces: [12, 2, 13, 2, 14, 3, 15, 3, 12, 2, 13, 2],
        transparent: true
    },
    //?

    0x49: {
        name: "redstone_ore",
        faces: [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3]
    },
    0x4A: {
        name: "lit_redstone_ore",
        faces: [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3]
    },
    0x4E: {
        name: "snow_layer",
        faces: [4, 4, 4, 4, 2, 4, 2, 0, 4, 4, 4, 4]
    },
    0x4F: {
        name: "ice",
        faces: [3, 4, 3, 4, 3, 4, 3, 4, 3, 4, 3, 4],
        transparent: true
    },
    0x51: {
        name: "cactus",
        faces: [6, 4, 6, 4, 5, 4, 5, 4, 6, 4, 6, 4],
        transparent: true
    },
    0x52: {
        name: "clay",
        faces: [8, 4, 8, 4, 8, 4, 8, 4, 8, 4, 8, 4]
    },
    0x53: {
        name: "reeds",
        faces: [9, 4, 9, 4, 9, 4, 9, 4, 9, 4, 9, 4],
        transparent: true
    },

    0x61: {
        name: "monster_egg",
        faces: [3, 7, 3, 7, 3, 7, 3, 7, 3, 7, 3, 7],
        transparent: true
    },

    0x6A: {
        name: "vine",
        faces: [15, 8, 15, 8, 15, 8, 15, 8, 15, 8, 15, 8],
        transparent: true
    },
    0x81: {
        name: "emerald_ore",
        faces: [11, 8, 11, 8, 11, 8, 11, 8, 11, 8, 11, 8],
        transparent: true
    },

    0xAF: {
        name: "double_plant",
        faces: [15, 6, 15, 6, 15, 6, 15, 6, 15, 6, 15, 6],
        transparent: true
    },
    //?
}
