module.exports = {
    pluginOptions: {
        electronBuilder: {
            nodeIntegration: true,
            externals: ['vue-json-viewer',"vue"],
            builderOptions:{
                "directories": {
                    "output": "build"
                },
                "files": [
                    "dist/electron/**/*"
                ],
                "dmg": {
                    "contents": [
                        {
                            "x": 410,
                            "y": 150,
                            "type": "link",
                            "path": "/Applications"
                        },
                        {
                            "x": 130,
                            "y": 150,
                            "type": "file"
                        }
                    ]
                },
                "mac": {
                    "icon": "build/icons/icon.png",
                    "target": [
                        "dmg",
                        "zip"
                    ]
                },
                "win": {
                    "icon": "build/icons/icon.png"
                },
                "linux": {
                    "icon": "build/icons"
                }
            }
        }
    }
}