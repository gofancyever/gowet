<template>
<div style="padding:24px;">
    <el-input
        type="textarea"
        @change="changeText"
        autosize
        placeholder="请输入加密内容"
        v-model="test">
    </el-input>
    <json-viewer style="text-align: left;" v-if="result" :copyable="true" :value="result"></json-viewer>
</div>
</template>

<script>
import encryptModule from '/src/module/encryptModule'
import { Message } from 'element-ui';
export default {
name: "DecodePanel",
    data() {
        return {
            test:'',
            result:null
        }
    },
    methods: {
        changeText(value){
            try {
                let encryptStr = encryptModule.sm4Decrypt(value)
                this.result = JSON.parse(encryptStr)
            }catch (e) {
                try {
                    let encryptStr = encryptModule.sm2Decrypt(value)
                    this.result = JSON.parse(encryptStr)
                }catch (e) {
                    try {
                        let encryptStr = encryptModule.sm2ResDecrypt(value)
                        this.result = JSON.parse(encryptStr)
                    }catch (e) {
                        try {
                            let encryptStr = encryptModule.j_img666555_e_m(value)
                            this.result = JSON.parse(encryptStr)
                        }catch (e) {
                            console.log(e)
                            Message.error('解密失败：'+e.message);
                        }
                    }

                }
            }


        }
    }
}
</script>

<style scoped>

</style>
