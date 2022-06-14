#!/bin/bash

echo "Cleaning..."
cd ..
pwd
watchman watch-del-all
rm -rf node_modules yarn.lock package-lock.json

rm -rf ios/Pods ios/Podfile.lock
# rm -rf ~/Library/Caches/CocoaPods ~/Library/Developer/Xcode/DerivedData/*

rm -rf android/.cxx android/.gradle
rm -rf android/app/build

echo "Installing..."
npm i

cd ios
pod deintegrate
pod setup
pod install --repo-update
cd ..