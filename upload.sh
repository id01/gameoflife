#!/bin/sh

python uglify.py
cd ..
tar czvf /tmp/gol.tgz gameoflife
cd gameoflife
scp /tmp/gol.tgz pi@192.168.1.3:/tmp
ssh pi@192.168.1.3 'cd /tmp; tar xvf gol.tgz; rm -r /var/www/public_html/gameoflife; mv gameoflife /var/www/public_html/gameoflife'
rm /tmp/gol.tgz