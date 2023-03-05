#bin/bash
pnpm run build
# mv ./dist ../nginx
cd ../nginx
rm -rf ./site
mv ./dist ./site
git add .
git commit -m 'update'
git push