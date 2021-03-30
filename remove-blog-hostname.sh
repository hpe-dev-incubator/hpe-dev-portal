#! /bin/sh

grep -rl 'https://developer.hpe.com/blog' ./content/blog | xargs sed -i '' -e 's,https://developer.hpe.com/blog,/blog,g'