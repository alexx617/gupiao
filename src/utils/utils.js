const utils = {
    setLocalStorage(key, value) {
        if (!key) return;
        try {
            const data = JSON.stringify(value);
            localStorage.setItem(key, data);
        } catch (e) {
            console.error('setLocalStorage error:', e);
        }
    },

    getLocalStorage(key) {
        if (!key) return null;
        try {
            const data = localStorage.getItem(key);
            if (data === null) return null;
            return JSON.parse(data);
        } catch (e) {
            console.error('getLocalStorage error:', e);
            return null;
        }
    },

    removeLocalStorage(key) {
        if (!key) return;
        try {
            localStorage.removeItem(key);
        } catch (e) {
            console.error('removeLocalStorage error:', e);
        }
    },

    clearLocalStorage() {
        try {
            localStorage.clear();
        } catch (e) {
            console.error('clearLocalStorage error:', e);
        }
    },

    setSessionStorage(key, value) {
        if (!key) return;
        try {
            const data = JSON.stringify(value);
            sessionStorage.setItem(key, data);
        } catch (e) {
            console.error('setSessionStorage error:', e);
        }
    },

    getSessionStorage(key) {
        if (!key) return null;
        try {
            const data = sessionStorage.getItem(key);
            if (data === null) return null;
            return JSON.parse(data);
        } catch (e) {
            console.error('getSessionStorage error:', e);
            return null;
        }
    },

    getCookie(name) {
        if (!name) return '';
        const reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
        const arr = document.cookie.match(reg);
        if (arr) {
            return unescape(arr[2]);
        }
        return '';
    },

    setCookie(name, value, days) {
        const exp = new Date();
        exp.setTime(exp.getTime() + days * 24 * 60 * 60 * 1000);
        document.cookie = name + '=' + escape(value) + ';expires=' + exp.toGMTString() + ';path=/';
    },

    removeCookie(name) {
        const exp = new Date();
        exp.setTime(exp.getTime() - 1);
        const value = this.getCookie(name);
        if (value) {
            document.cookie = name + '=' + value + ';expires=' + exp.toGMTString() + ';path=/';
        }
    },

    debounce(fn, delay = 300) {
        let timer = null;
        return function (...args) {
            if (timer) clearTimeout(timer);
            timer = setTimeout(() => {
                fn.apply(this, args);
            }, delay);
        };
    },

    throttle(fn, delay = 300) {
        let lastTime = 0;
        return function (...args) {
            const now = Date.now();
            if (now - lastTime >= delay) {
                lastTime = now;
                fn.apply(this, args);
            }
        };
    },

    deepClone(obj) {
        if (obj === null || typeof obj !== 'object') return obj;
        const clone = Array.isArray(obj) ? [] : {};
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                clone[key] = this.deepClone(obj[key]);
            }
        }
        return clone;
    },

    isEmpty(value) {
        if (value === null || value === undefined) return true;
        if (typeof value === 'string') return value.trim() === '';
        if (Array.isArray(value)) return value.length === 0;
        if (typeof value === 'object') return Object.keys(value).length === 0;
        return false;
    },

    isNumber(value) {
        return !isNaN(parseFloat(value)) && isFinite(value);
    },

    formatNumber(num, decimals = 2) {
        if (!this.isNumber(num)) return '0';
        return Number(num).toFixed(decimals);
    }
};

export default utils;
