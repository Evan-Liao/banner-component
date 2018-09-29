const banner = require("./index.vue");

const BannerConstructor = Vue.extend(banner);

let currentBanner, instance;
let bannerQueue = [];

const defaultCallback = action => {
    if (currentBanner) {
        let callback = currentBanner.callback;

        if (typeof callback === 'function') {
            callback(action)
        }
    }

    if (currentBanner.resolve) {
        if (action === 'confirm') {
            currentBanner.resolve(action);
        }else if (action === 'cancel') {
            currentBanner.reject(action);
        }
    }
};

const initInstance = () => {
    instance = new BannerConstructor({
        el: '__init__'
    });

    instance.callback = defaultCallback;
};

const showNextBanner = () => {
    if (currentBanner) {
        instance.destroy = true;
        instance = null;
    }

    initInstance();

    if (!instance.visible) {
        if (bannerQueue.length > 0) {
            currentBanner = bannerQueue.shift();
        }

        let options = currentBanner.options;
        for(let prop in options) {
            if (options.hasOwnProperty(prop)) {
                instance[prop] = options[prop]
            }
        }
        if (options.callback === undefined) {
            instance.callback = defaultCallback;
        }

        Vue.nextTick(() => {
            instance.visible = true;
        })
    }
};

const Banner = function (options, callback) {
    if (typeof options === 'string') {
        options = {
            text: options
        }
    }else if (options.callback && !callback) {
        callback = options.callback;
    }

    // 或许banner并不需要promise...
    return new Promise(((resolve, reject) => {
        bannerQueue.push({
            options: options,
            callback: callback,
            resolve: resolve,
            reject: reject
        });

        showNextBanner();
    }))
};

['loading', 'normal', 'success', 'error'].forEach(type => {
    Banner[type] = options => {
        if (typeof options === 'string') {
            options = {
                text: options
            }
        }

        options.type = type;
        return Banner(options);
    }
});

Banner.destroy = () => {
    instance.destroy = true;
};

const initBannerToGlobal = () => {
    Vue.mixin({
        created: function () {
            this.$banner = Banner
        }
    });
};

initBannerToGlobal();

export default Banner;

