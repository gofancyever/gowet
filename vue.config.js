module.exports = {
    pluginOptions: {
        electronBuilder: {
            nodeIntegration: true,
            externals: ['vue-json-viewer',"vue"],
            builderOptions:{
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
                    "target": {
                        target: 'default',
                        arch: [
                            'x64',
                            'arm64'
                        ]
                    }
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