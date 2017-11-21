import os;
import glob;

os.system("uglifyjs --compress dead_code=true --mangle sort,eval game/gameoflife.js > game/gameoflife.min.js");
os.system("uglifyjs --compress dead_code=true --mangle sort,eval mapselect.js > mapselect.min.js");