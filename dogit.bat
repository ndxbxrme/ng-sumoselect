call grunt build
git add --all
git commit -m %2
git push origin master
call bower version %1
call npm version %1 --no-git-tag-version
git push origin --tags
