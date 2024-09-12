#! /bin/sh

set -e

git clone "https://github.com/Yqnn/baby-food.git" .baby-food-master
cd .baby-food-master
npm install
npm run build
mv dist ../.baby-food-master-build
git checkout .
git checkout gh-pages
rm -rf *
mv ../.baby-food-master-build/* .
git add --all
git commit -m "Refreshed gh-pages from master" -S
git show --stat

read -p "Confirm publication? [yn] " -r
if [[ $REPLY =~ ^[Yy]$ ]]
then
    echo
    git push origin gh-pages

fi
echo

cd ..
rm -rf .baby-food-master .baby-food-master-build
