<template>
  <div style="width=100%;margin-top:15px;padding-right:15px;padding-left:15px;">
    <img :src="vueCam.img" width="100%" style="cursor:pointer" @click="$refs.fileInput.click()">
    <input ref="fileInput" type="file" style="display:none" @change="fileChanged">
    <!-- <div style="width:100%;margin-bottom:3px;">
            <el-button size="mini" style="width:100%">Browse</el-button>
        </div> -->
    <div style="width:100%">
      <el-button size="mini" style="width:100%" @click="camera_dialog=true">Camera</el-button>
    </div>
    <el-dialog
      title="Camera"
      width="30%"
      :show-close="false"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :visible.sync="camera_dialog"
    >
      <el-row>
        <el-col>
          <web-cam
            ref="webcam"
            :device-id="vueCam.deviceId"
            width="100%"
            height="100%"
            :autoplay="vueCam.autoplay"
            @started="onStarted"
            @stopped="onStopped"
            @error="onError"
            @cameras="onCameras"
            @camera-change="onCameraChange"
          />
        </el-col>
      </el-row>
      <el-row style="margin-top:10px;">
        <el-col>
          <el-select v-model="vueCam.camera" size="mini" placeholder="Select..." style="width:100%">
            <el-option
              v-for="item in vueCam.devices"
              :key="item.deviceId"
              :label="item.label"
              :value="item.deviceId"
            />
          </el-select>
        </el-col>
      </el-row>
      <el-row style="margin-top:5px;">
        <el-col :xs="{span:24}" :sm="{span:24}" :md="{span:8}" :lg="{span:8}" :xl="{span:8}">
          <el-button type="danger" :plain="true" size="mini" style="width:100%" :disabled="vueCam.buttons.start" @click="onStart">Start</el-button>
        </el-col>
        <el-col :xs="{span:24}" :sm="{span:24}" :md="{span:8}" :lg="{span:8}" :xl="{span:8}">
          <el-button type="danger" :plain="true" size="mini" style="width:100%" :disabled="vueCam.buttons.capture" @click="capture">Capture</el-button>
        </el-col>
        <el-col :xs="{span:24}" :sm="{span:24}" :md="{span:8}" :lg="{span:8}" :xl="{span:8}">
          <el-button type="danger" :plain="true" size="mini" style="width:100%" :disabled="vueCam.buttons.stop" @click="onStop">Close</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { WebCam } from 'vue-web-cam'
export default {
  components: {
    WebCam
  },
  data() {
    return {
      image: 'cnmfinal.png',
      camera_dialog: false,
      vueCam: {
        img: 'favicon.ico',
        imgfile: null,
        camera: null,
        deviceId: null,
        devices: [],
        autoplay: false,
        buttons: {
          stop: false,
          capture: false,
          start: false
        }
      }
    }
  },
  computed: {
    device: function() {
      return this.vueCam.devices.find(
        n => n.deviceId === this.vueCam.deviceId
      )
    }
  },
  watch: {
    'vueCam.camera': function(id) {
      this.vueCam.deviceId = id
    },
    'vueCam.devices': function() {
      // Once we have a list select the first one
      const [first, ...tail] = this.vueCam.devices
      if (first) {
        this.vueCam.camera = first.deviceId
        this.vueCam.deviceId = first.deviceId
      }
    }
  },
  methods: {
    // VUE camera
    fileChanged(event) {
      this.$emit('image', event.target.files[0])
    },
    capture() {
      this.vueCam.buttons.capture = true
      this.vueCam.img = this.$refs.webcam.capture()
      this.vueCam.buttons.capture = false
      const part = this.vueCam.img.split(';')
      const conType = part[0].split(':')[1]
      const data = part[1].split(',')[1]
      const ext = conType.split('/')[1]
      const imageBlob = this.base64tofile(data, conType)

      const date = new Date().valueOf()
      let text = ''
      const possibleText = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
      for (let i = 0; i < 5; i++) {
        text += possibleText.charAt(Math.floor(Math.random() * possibleText.length))
      }

      // Replace extension according to your media type
      const imageName = date + '.' + text + '.' + ext
      // call method that creates a blob from dataUri
      const imageFile = new File([imageBlob], imageName, { type: conType })
      this.$emit('image', imageFile)
      // console.log(imageFile);
    },
    onStarted(stream) {
      console.log('On Started Event', stream)
      this.vueCam.autoplay = true
      this.vueCam.buttons.stop = false
      this.vueCam.buttons.capture = false
    },
    onStopped(stream) {
      console.log('On Stopped Event', stream)
      // this.vueCam.autoplay = false;
      // this.vueCam.buttons.stop = false;
      this.camera_dialog = false
    },
    onStop() {
      this.vueCam.buttons.capture = true
      this.$refs.webcam.stop()
    },
    onStart() {
      this.$refs.webcam.start()
    },
    onError(error) {
      console.log('On Error Event', error)
    },
    onCameras(cameras) {
      this.vueCam.devices = cameras
      console.log('On Cameras Event', cameras)
    },
    onCameraChange(deviceId) {
      this.vueCam.deviceId = deviceId
      this.vueCam.camera = deviceId
      console.log('On Camera Change Event', deviceId)
    },
    // End vue camera

    base64tofile(b64Data, contentType, sliceSize) {
      contentType = contentType || ''
      sliceSize = sliceSize || 512

      var byteCharacters = atob(b64Data)
      var byteArrays = []

      for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        var slice = byteCharacters.slice(offset, offset + sliceSize)

        var byteNumbers = new Array(slice.length)
        for (var i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i)
        }

        var byteArray = new Uint8Array(byteNumbers)

        byteArrays.push(byteArray)
      }

      var blob = new Blob(byteArrays, { type: contentType })
      console.log(blob)
      return blob
    }
  }
}
</script>

<style>

</style>
