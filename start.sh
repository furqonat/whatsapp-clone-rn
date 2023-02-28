#!/bin/bash
export PATH=~/Android/Sdk/platform-tools/

adb shell am start -n "com.rekberindo.app/com.rekberindo.app.MainActivity" -a android.intent.action.MAIN -c android.intent.category.LAUNCHER

#cd ~/Devs/furqon/native-app/

#yarn start

