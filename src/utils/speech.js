const speech = {
    isSupported() {
        return 'speechSynthesis' in window;
    },

    getVoices() {
        if (!this.isSupported()) return [];
        return window.speechSynthesis.getVoices();
    },

    getChineseVoice() {
        const voices = this.getVoices();
        return voices.find(voice => voice.lang.includes('zh')) || voices[0];
    },

    speak(text, options = {}) {
        return new Promise((resolve, reject) => {
            if (!this.isSupported()) {
                reject(new Error('浏览器不支持语音播报'));
                return;
            }

            if (!text) {
                resolve();
                return;
            }

            const utterance = new SpeechSynthesisUtterance(text);
            const chineseVoice = this.getChineseVoice();

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

            window.speechSynthesis.speak(utterance);
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

if (speech.isSupported()) {
    window.speechSynthesis.onvoiceschanged = () => {
        speech.getVoices();
    };
}

export default speech;
