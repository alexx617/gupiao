const speech = {
    isSupported() {
        return 'speechSynthesis' in window;
    },

    voicesLoaded: false,
    voicesPromise: null,

    getVoices() {
        if (!this.isSupported()) return [];
        return window.speechSynthesis.getVoices();
    },

    async waitForVoices() {
        if (this.voicesLoaded) return this.getVoices();
        
        if (this.voicesPromise) return this.voicesPromise;
        
        const voices = this.getVoices();
        if (voices.length > 0) {
            this.voicesLoaded = true;
            return voices;
        }
        
        this.voicesPromise = new Promise((resolve) => {
            const checkVoices = () => {
                const v = this.getVoices();
                if (v.length > 0) {
                    this.voicesLoaded = true;
                    resolve(v);
                }
            };
            
            if (window.speechSynthesis.onvoiceschanged !== undefined) {
                window.speechSynthesis.onvoiceschanged = checkVoices;
            }
            
            setTimeout(() => {
                checkVoices();
            }, 100);
        });
        
        return this.voicesPromise;
    },

    getChineseVoice(voices) {
        return voices.find(voice => voice.lang.includes('zh')) || voices[0];
    },

    async speak(text, options = {}) {
        if (!this.isSupported()) {
            throw new Error('浏览器不支持语音播报');
        }

        if (!text) {
            return;
        }

        const voices = await this.waitForVoices();
        
        return new Promise((resolve, reject) => {
            const utterance = new SpeechSynthesisUtterance(text);
            const chineseVoice = this.getChineseVoice(voices);

            if (chineseVoice) {
                utterance.voice = chineseVoice;
            }

            utterance.lang = options.lang || 'zh-CN';
            utterance.rate = options.rate || 1;
            utterance.pitch = options.pitch || 1;
            utterance.volume = options.volume || 1;

            utterance.onend = () => {
                resolve();
            };

            utterance.onerror = (event) => {
                reject(new Error(`语音播报失败: ${event.error}`));
            };

            window.speechSynthesis.cancel();
            
            setTimeout(() => {
                window.speechSynthesis.speak(utterance);
            }, 50);
        });
    },

    stop() {
        if (!this.isSupported()) return;
        window.speechSynthesis.cancel();
    },

    pause() {
        if (!this.isSupported()) return;
        window.speechSynthesis.pause();
    },

    resume() {
        if (!this.isSupported()) return;
        window.speechSynthesis.resume();
    },

    isSpeaking() {
        if (!this.isSupported()) return false;
        return window.speechSynthesis.speaking;
    },

    isPaused() {
        if (!this.isSupported()) return false;
        return window.speechSynthesis.paused;
    }
};

export default speech;
