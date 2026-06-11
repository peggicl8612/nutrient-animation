/**
 * 以 Web Audio API 即時合成的柔和環境音樂引擎。
 * 不需要任何音檔資源:以緩慢交疊的和弦墊音(pad)循環播放,
 * 搭配低通濾波與簡易殘響,營造輕柔的太空氛圍。
 */

const MUSUC_SRC = `${import.meta.env.BASE_URL}bg-music.mp3`
const VOLUME = 0.3; // 柔和背景音量



class AmbientMusicEngine {
  private audio: HTMLAudioElement | null = null;
  private playing = false;

  get isPlaying(): boolean {
    return this.playing;
  }

  private getAudio() {
    if (!this.audio) {
      this.audio = new Audio(MUSUC_SRC);
      this.audio.loop = true;
      this.audio.preload = 'auto';
      this.audio.volume = VOLUME;
    }
    return this.audio;
  }

  async start() {
    if (this.playing) return;
    const audio = this.getAudio(); // 取得音檔元素
    await audio.play(); // 需使用者點擊才能播放
    this.playing = true;
  }

  stop() {
    if (!this.playing) return;
    const audio = this.getAudio();
    audio.pause();
    audio.currentTime = 0;
    this.playing = false;
  }

  async toggle(): Promise<boolean> {
    if (this.playing) this.stop();
    else await this.start();
    return this.playing;
  }
}

export const ambientMusic = new AmbientMusicEngine();
