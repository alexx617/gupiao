const format = {
    formatPrice(value) {
        if (value === null || value === undefined || value === '') return '--';
        const num = Number(value);
        if (isNaN(num)) return '--';
        return num.toFixed(2);
    },

    formatPercent(value) {
        if (value === null || value === undefined || value === '') return '--';
        const num = Number(value);
        if (isNaN(num)) return '--';
        return (num / 1000).toFixed(2);
    },

    formatVolume(value) {
        if (value === null || value === undefined || value === '') return '--';
        const num = Number(value);
        if (isNaN(num)) return '--';
        return num.toLocaleString('zh-CN');
    },

    formatAmount(value) {
        if (value === null || value === undefined || value === '') return '--';
        const num = Number(value);
        if (isNaN(num)) return '--';
        return num.toLocaleString('zh-CN');
    },

    formatTime(time, format = 'HH:mm:ss') {
        if (!time) return '--';
        const timeStr = String(time);
        let hours = '00';
        let minutes = '00';
        let seconds = '00';

        if (timeStr.length === 6) {
            hours = timeStr.substring(0, 2);
            minutes = timeStr.substring(2, 4);
            seconds = timeStr.substring(4, 6);
        } else if (timeStr.length === 4) {
            hours = timeStr.substring(0, 2);
            minutes = timeStr.substring(2, 4);
        } else if (timeStr.length === 8) {
            hours = timeStr.substring(0, 2);
            minutes = timeStr.substring(2, 4);
            seconds = timeStr.substring(4, 6);
        }

        return format
            .replace('HH', hours)
            .replace('mm', minutes)
            .replace('ss', seconds);
    },

    formatDate(date, format = 'YYYY-MM-DD') {
        if (!date) return '--';
        let d;
        if (date instanceof Date) {
            d = date;
        } else if (typeof date === 'string' || typeof date === 'number') {
            d = new Date(date);
        } else {
            return '--';
        }

        if (isNaN(d.getTime())) return '--';

        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        const seconds = String(d.getSeconds()).padStart(2, '0');

        return format
            .replace('YYYY', year)
            .replace('MM', month)
            .replace('DD', day)
            .replace('HH', hours)
            .replace('mm', minutes)
            .replace('ss', seconds);
    },

    formatDateTime(dateTime, format = 'YYYY-MM-DD HH:mm:ss') {
        return this.formatDate(dateTime, format);
    },

    formatNumber(value, decimals = 2) {
        if (value === null || value === undefined || value === '') return '--';
        const num = Number(value);
        if (isNaN(num)) return '--';
        return num.toFixed(decimals);
    },

    formatMoney(value, decimals = 2) {
        if (value === null || value === undefined || value === '') return '--';
        const num = Number(value);
        if (isNaN(num)) return '--';
        return num.toLocaleString('zh-CN', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        });
    },

    formatChange(value, showSign = true) {
        if (value === null || value === undefined || value === '') return '--';
        const num = Number(value);
        if (isNaN(num)) return '--';
        const result = this.formatPercent(value);
        if (showSign && num > 0) {
            return '+' + result;
        }
        return result;
    }
};

export default format;
