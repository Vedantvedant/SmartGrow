const fs = require("fs");
const path = require("path");

const gradleFile = path.resolve(__dirname, "../node_modules/react-native-mqtt/android/build.gradle");

const fixedGradleContent = `buildscript {
    repositories {
        google()
        mavenCentral()
    }
    dependencies {
        classpath 'com.android.tools.build:gradle:7.0.2'
    }
}

apply plugin: 'com.android.library'

android {
    compileSdkVersion 33
    buildToolsVersion "30.0.3"

    defaultConfig {
        minSdkVersion 21
        targetSdkVersion 33
        versionCode 1
        versionName "1.0"
    }
    lintOptions {
        abortOnError false
    }
}

repositories {
    mavenCentral()
    maven {
        url "https://repo.eclipse.org/content/repositories/paho-releases/"
    }
}

dependencies {
    implementation 'com.facebook.react:react-native:+'
    implementation('org.eclipse.paho:org.eclipse.paho.client.mqttv3:1.2.5') {
        exclude module: 'support-v4'
    }
    implementation 'org.bouncycastle:bcprov-jdk15on:1.70'
}`;

fs.writeFile(gradleFile, fixedGradleContent, "utf8", (err) => {
    if (err) {
        console.error("Error writing build.gradle:", err);
    } else {
        console.log("✅ Fixed react-native-mqtt build.gradle!");
    }
});
