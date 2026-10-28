import fs from 'fs';

// Let's write the exact 144 starts for 15D
// Index 0: 002.jpg -> 1
// Index 1: 003.jpg -> 2
// Index 2: 004.jpg -> 3
// Index 3: 005.jpg -> 4 (4-9)
// Index 4: 006.jpg -> 10
// Index 5: 007.jpg -> 11
// Index 6: 008.jpg -> 12 (12-13)
// Index 7: 009.jpg -> 14 (14-15)
// Index 8: 010.jpg -> 16
// Index 9: 011.jpg -> 17
// Index 10: 012.jpg -> 18
// Index 11: 013.jpg -> 19
// Index 12: 014.jpg -> 20 (20-29)
// Index 13: 015.jpg -> 30
// Index 14: 016.jpg -> 31
// Index 15: 017.jpg -> 32
// Index 16: 018.jpg -> 33
// Index 17: 019.jpg -> 34 (34-36)
// Index 18: 020.jpg -> 37 (37-38)
// Index 19: 021.jpg -> 39
// Index 20: 022.jpg -> 40
// Index 21: 023.jpg -> 41
// Index 22: 024.jpg -> 42
// Index 23: 025.jpg -> 43
// Index 24: 026.jpg -> 44 (44-45)
// Index 25: 027.jpg -> 46
// Index 26: 028.jpg -> 47
// Index 27: 029.jpg -> 48
// Index 28: 030.jpg -> 49
// Index 29: 031.jpg -> 50
// Index 30: 032.jpg -> 51
// Index 31: 033.jpg -> 52
// Index 32: 034.jpg -> 53 (53-54)
// Index 33: 035.jpg -> 55
// Index 34: 036.jpg -> 56
// Index 35: 037.jpg -> 57 (57-58)
// Index 36: 038.jpg -> 59 (59-64)
// Index 37: 039.jpg -> 65 (65-66)
// Index 38: 040.jpg -> 67
// Index 39: 041.jpg -> 68 (68-71)
// Index 40: 042.jpg -> 72 (72-73)
// Index 41: 043.jpg -> 74
// Index 42: 044.jpg -> 75
// Index 43: 045.jpg -> 76 (76-84)
// Index 44: 046.jpg -> 85
// Index 45: 047.jpg -> 86
// Index 46: 048.jpg -> 87
// Index 47: 049.jpg -> 88 (88-89)
// Index 48: 050.jpg -> 90
// Index 49: 051.jpg -> 91
// Index 50: 052.jpg -> 92 (92-95)
// Index 51: 053.jpg -> 96 (96-99)
// Index 52: 054.jpg -> 100
// Index 53: 055.jpg -> 101
// Index 54: 056.jpg -> 102
// Index 55: 057.jpg -> 103
// Index 56: 058.jpg -> 104
// Index 57: 059.jpg -> 105 (105-111)
// Index 58: 060.jpg -> 112
// Index 59: 061.jpg -> 113
// Index 60: 062.jpg -> 114
// Index 61: 063.jpg -> 115 (115-116)
// Index 62: 064.jpg -> 117 (117-120)
// Index 63: 065.jpg -> 121
// Index 64: 066.jpg -> 122
// Index 65: 067.jpg -> 123 (123-128)
// Index 66: 068.jpg -> 129 (129-131)
// Index 67: 069.jpg -> 132
// Index 68: 070.jpg -> 133
// Index 69: 071.jpg -> 134
// Index 70: 072.jpg -> 135
// Index 71: 073.jpg -> 136
// Index 72: 074.jpg -> 137
// Index 73: 075.jpg -> 138 (138-143)
// Index 74: 076.jpg -> 144
// Index 75: 077.jpg -> 145 (145-148)
// Index 76: 078.jpg -> 149 (149-151)
// Index 77: 079.jpg -> 152
// Index 78: 080.jpg -> 153 (153-154)
// Index 79: 081.jpg -> 155
// Index 80: 082.jpg -> 156
// Index 81: 083.jpg -> 157
// Index 82: 084.jpg -> 158
// Index 83: 085.jpg -> 159
// Index 84: 086.jpg -> 160
// Index 85: 087.jpg -> 161 (161-162)
// Index 86: 088.jpg -> 163
// Index 87: 089.jpg -> 164
// Index 88: 090.jpg -> 165
// Index 89: 091.jpg -> 166
// Index 90: 092.jpg -> 167 (167-168)
// Index 91: 093.jpg -> 169
// Index 92: 094.jpg -> 170
// Index 93: 095.jpg -> 171
// Index 94: 096.jpg -> 172 (172-174)
// Index 95: 097.jpg -> 175
// Index 96: 098.jpg -> 176
// Index 97: 099.jpg -> 177 (177-178)
// Index 98: 100.jpg -> 179 (179-180)
// Index 99: 101.jpg -> 181 (181-188)
// Index 100: 102.jpg -> 189
// Index 101: 103.jpg -> 190 (190-199)
// Index 102: 104.jpg -> 200
// Index 103: 105.jpg -> 201 (201-210)
// Index 104: 106.jpg -> 211 (211-212)
// Index 105: 107.jpg -> 213 (213-214)
// Index 106: 108.jpg -> 215
// Index 107: 109.jpg -> 216 (216-222)
// Index 108: 110.jpg -> 223
// Index 109: 111.jpg -> 224
// Index 110: 112.jpg -> 225 (225-233)
// Index 111: 113.jpg -> 234
// Index 112: 114.jpg -> 235
// Index 113: 115.jpg -> 236
// Index 114: 116.jpg -> 237
// Index 115: 117.jpg -> 238
// Index 116: 118.jpg -> 239
// Index 117: 119.jpg -> 240
// Index 118: 120.jpg -> 241
// Index 119: 121.jpg -> 242 (242-247)
// Index 120: 122.jpg -> 248 (248-257)
// Index 121: 123.jpg -> 258 (258-260)
// Index 122: 124.jpg -> 261
// Index 123: 125.jpg -> 262
// Index 124: 126.jpg -> 263
// Index 125: 127.jpg -> 264
// Index 126: 128.jpg -> 265 (265-271)
// Index 127: 129.jpg -> 272 (272-274)
// Index 128: 130.jpg -> 275 (275-277)
// Index 129: 131.jpg -> 278 (278-279)
// Index 130: 132.jpg -> 280 (280-283)
// Index 131: 133.jpg -> 284
// Index 132: 134.jpg -> 285
// Index 133: 135.jpg -> 286 (286-288)
// Index 134: 136.jpg -> 289
// Index 135: 137.jpg -> 290
// Index 136: 138.jpg -> 291
// Index 137: 139.jpg -> 292 (292-293)
// Index 138: 140.jpg -> 294 (294-295)
// Index 139: 141.jpg -> 296
// Wait! Let's check why there are 144 items in data15D!
