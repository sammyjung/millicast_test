export default class MillicastMedia {
  constructor(options) {
    //constructor syntactic sugar
    this.mediaStream = null;

    this.constraints = {
      audio: {
        echoCancellation: false,
        channelCount: { ideal: 2 },
      },
      // 비디오 사이즈
      video: {
        height: 1080,
        width: 1920,
      },
    };
    /*옵션 적용*/
    if (options && !!options.constraints)
      Object.assign(this.constraints, options.constraints);
  }

  /**
   * Get 가상 장치.
   * @example const devices = await millicastMedia.getDevices;
   * @returns {Promise} devices - sorted object containing arrays with audio devices and video devices.
   */

  get getDevices() {
    return this.getMediaDevices();
  }

  getInput(kind) {
    let input = null;
    if (!kind) return input;
    if (this.mediaStream) {
      for (let track of this.mediaStream.getTracks()) {
        if (track.kind === kind) {
          input = track;
          break;
        }
      }
    }
    return input;
  }

  /**
   * Get 활성화된 비디오 기기.
   * @example const videoInput = millicastMedia.videoInput;
   * @returns {MediaStreamTrack}
   */

  get videoInput() {
    return this.getInput('video');
  }

  /**
   * Get 활성된 오디오 기기.
   * @example const audioInput = millicastMedia.audioInput;
   * @returns {MediaStreamTrack}
   */

  get audioInput() {
    return this.getInput('audio');
  }

  /**
   * Get 유저 미디어.
   * @example const media = await MillicastMedia.getMedia();
   * @returns {MediaStream}
   */

  async getMedia() {
    //gets user 카메라 and 마이크
    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia(
        this.constraints
      );
      return this.mediaStream;
    } catch (error) {
      console.error('Could not get Media: ', error, this.constraints);
      throw error;
    }
  }

  async getMediaDevices() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices)
      throw new Error(
        'Could not get list of media devices!  This might not be supported by this browser.'
      );

    try {
      const items = { audioinput: [], videoinput: [], audiooutput: [] };
      const mediaDevices = await navigator.mediaDevices.enumerateDevices();
      for (const device of mediaDevices)
        this.addMediaDevicesToList(items, device);
      this.devices = items;
    } catch (error) {
      console.error('Could not get Media: ', error);
      this.devices = [];
    }
    return this.devices;
  }

  addMediaDevicesToList(items, device) {
    if (device.deviceId !== 'default' && items[device.kind])
      items[device.kind].push(device);
  }

  /**
   * @param {String} id - the id 선택된 비디오 기기 아이디.
   * @example const media = await millicastMedia.changeVideo(id);
   * @returns {MediaStream} - stream from 최근에 선택된 비디오 디바이스.
   */

  async changeVideo(id) {
    return await this.changeSource(id, 'video');
  }

  /**
   * @param {String} id - the id 선택된 오디오 기기 아이디.
   * @example const media = await millicastMedia.changeAudio(id);
   * @returns {MediaStream} - stream from 최근에 선택된 오디오 디바이스.
   */

  async changeAudio(id) {
    return await this.changeSource(id, 'audio');
  }

  async changeSource(id, sourceType) {
    if (!id) throw new Error('Required id');

    this.constraints[sourceType] = {
      ...this.constraints[sourceType],
      deviceId: {
        exact: id,
      },
    };
    return await this.getMedia();
  }

  /**
   * @param {boolean} boolean - true if you want to mute the video, false for mute it.
   * @returns {boolean} - returns true if it was changed, otherwise returns false.
   */

  muteVideo(boolean = true) {
    let changed = false;
    if (this.mediaStream) {
      this.mediaStream.getVideoTracks()[0].enabled = !boolean;
      changed = true;
    } else {
      console.error('There is no media stream object.');
    }
    return changed;
  }

  /**
   * @param {boolean} boolean - true if you want to mute the audio, false for mute it.
   * @returns {boolean} - returns true if it was changed, otherwise returns false.
   */

  muteAudio(boolean = true) {
    let changed = false;
    if (this.mediaStream) {
      this.mediaStream.getAudioTracks()[0].enabled = !boolean;
      changed = true;
    } else {
      console.error('There is no media stream object.');
    }
    return changed;
  }
}
