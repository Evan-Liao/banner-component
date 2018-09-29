<template>
    <div class="container" ref="container" :style="containerStyle">
        <m-node normal-class="wrapper" @on-hover-change="onHover">
            <div class="type_symbol">
                <div class="loading" v-show="type === 'loading'">
                    <img class="loading_symbol" :style="$sprite('spin', 'loading_dark')" ref="spinner"/>
                </div>
                <div v-show="type === 'normal'" :style="$sprite('notice', 'icon_normal')"></div>
                <div v-show="type === 'success'" :style="$sprite('notice', 'icon_success')"></div>
                <div v-show="type === 'error'" :style="$sprite('notice', 'icon_error')"></div>
            </div>

            <div class="text">{{ text }}</div>

            <div class="extra" v-show="extraOption" @click="handleOnClick">{{ extraOptionText }}</div>
        </m-node>
    </div>
</template>
<script lang="ts">
    import styleScope from './index.styl';
    import { spinnerRotate } from "shared/utils/animation";

    export default {
        name: 'banner',
        data() {
            return {
                styleScope,
                visible: false,
                extraOption: false,
                leftSideCenter: false,
                destroy: false,

                type: '',
                text: '',
                extraOptionText: '撤销',

                duration: null,
                callback: null,
                autoCloseTimerId: null,
            }
        },
        watch: {
            visible(val) {
                this.$nextTick(() => {
                    if (val) {
                        this.bannerEntryAnimate();
                    }else {
                        this.bannerExitAnimate();
                    }
                })
            },
            destroy(val) {
                if (val) {
                    this.cleanAutoCloseTimer();
                    this.$el.parent.removeChild(this.$el);
                }
            }
        },
        computed: {
            containerStyle() {
                return {
                    width: this.leftSideCenter ? '100%-306' : '100%',
                }
            }
        },
        methods: {
            onHover(hover) {
                if (!this.extraOption) return;

                if (hover) {
                    this.cleanAutoCloseTimer();
                }else {
                    this.setAutoCloseTimer();
                }
            },
            handleOnClick() {
                this.callback();
                this.visible = false;
            },
            bannerEntryAnimate() {
                if (this.destroy) return;

                let $wrapper = this.$el;

                let animation = $wrapper.anime({
                    top: {
                        value: [-40, DeviceInfo.isOSX() || DeviceInfo.isMac() ? 16 : 46]
                    }
                }, {
                    easing: 'spring',
                    stiffness: 300,
                    velocity: 5,
                    dampingRadio: 1,
                });

                animation.onComplete(() => {
                    this.cleanAutoCloseTimer();
                    this.setAutoCloseTimer();
                });

                animation.play();
            },
            bannerExitAnimate() {
                if (this.destroy) return;

                let $wrapper = this.$el;

                let animation = $wrapper.anime({
                    top: {
                        value: ['current', -40]
                    }
                }, {
                    easing: 'spring',
                    stiffness: 300,
                    velocity: 5,
                    dampingRadio: 1,
                });

                animation.play();
            },
            setAutoCloseTimer() {
                this.duration = this.type === 'loading' ? 0 : 3000;
                if (this.duration > 0) {
                    this.autoCloseTimerId = setTimeout(() => {
                        this.visible = false;
                        this.cleanAutoCloseTimer();
                    }, this.duration);
                }
            },
            cleanAutoCloseTimer() {
                if (this.autoCloseTimerId) {
                    clearTimeout(this.autoCloseTimerId);
                    this.autoCloseTimerId = null;
                }
            }

        },

        mounted() {
            this._animate = spinnerRotate(this.$refs.spinner);
            this._animate.rotateStart();
        },

        beforeDestroy() {
            this._animate.rotateStop();
            this._animate = null;
        }
    }

</script>