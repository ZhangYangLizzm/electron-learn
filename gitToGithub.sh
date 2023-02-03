#! bin/bash
# 确保脚本抛出遇到的错误
set -e

# if [ ! -n "$1" ]; then
if [ "$1" = "" ]; then
    echo "没有指定提交信息"
else
    echo $1
    git add .
    git commit -m "$1"
    git push -f git@github.com:ZhangYangLizzm/electron-learn.git main
fi
