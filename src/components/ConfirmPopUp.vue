<template>
    <div v-if="visible" role="alertdialog" class="p-confirm-popup p-component" aria-modal="true" id="confirm"
        aria-label="popup" data-pc-name="confirmpopup" data-pc-section="root" data-pd-focustrap="true"
        :style="positionStyles"
        :class="themeClass">
        <span class="p-hidden-accessible p-hidden-focusable" tabindex="0" role="presentation" aria-hidden="true"
            data-p-hidden-accessible="true" data-p-hidden-focusable="true"
            data-pc-section="firstfocusableelement"></span>
        <div class="p-confirm-popup-content" data-pc-section="content">
            <span class="p-confirm-popup-message" data-pc-section="message">{{ message }}</span>
        </div>
        <div class="p-confirm-popup-footer rounded-lg" data-pc-section="footer">
            <button class="p-button p-component p-confirm-popup-reject p-button-sm p-button-text" type="button"
                aria-label="No" @click.stop="hide"
                :class="rejectButtonClass"><span class="p-button-label">{{ $t('message.no') }}</span></button>
            <button class="p-button p-component p-confirm-popup-accept p-button-sm" type="button" aria-label="Yes"
                @click.stop="accept"
                :class="acceptButtonClass"><span class="p-button-label">{{ $t('message.yes') }}</span></button>
        </div>
        <span class="p-hidden-accessible p-hidden-focusable" tabindex="0" role="presentation" aria-hidden="true"
            data-p-hidden-accessible="true" data-p-hidden-focusable="true"
            data-pc-section="lastfocusableelement"></span>
    </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
    name: 'ConfirmPopUp',
    props: {
        message: {
            type: String,
            default: ''
        }
    },
    computed: {
        ...mapState(['userSettings']),
        themeClass() {
            return this.userSettings.theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-600 text-gray-100';
        },
        rejectButtonClass() {
            return this.userSettings.theme === 'light' ? 'bg-red-500 text-white hover:bg-red-700' : 'bg-red-700 text-gray-100 hover:bg-red-500';
        },
        acceptButtonClass() {
            return this.userSettings.theme === 'light' ? 'bg-green-500 text-white hover:bg-green-700' : 'bg-green-700 text-gray-100 hover:bg-green-500';
        }
    },
    data() {
        return {
            visible: false,
            target: null,
            positionStyles: {
                top: '0px',
                left: '0px',
                position: 'absolute',
                zIndex: '1001',
                transformOrigin: 'center top'
            }
        };
    },
    methods: {
        show(target) {
            this.target = target;
            this.updatePosition();
            this.visible = true;
            window.addEventListener('scroll', this.updatePosition, true);
            window.addEventListener('resize', this.updatePosition);
        },
        hide() {
            this.visible = false;
            window.removeEventListener('scroll', this.updatePosition, true);
            window.removeEventListener('resize', this.updatePosition);
        },
        updatePosition() {
            const viewportWidth = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
            const viewportHeight = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
            this.positionStyles = {
                ...this.positionStyles,
                top: `${viewportHeight / 2}px`,
                left: `${viewportWidth / 2}px`,
                transform: 'translate(-50%, -50%)'
            };
        },
        accept() {
            this.$emit('accept');
            this.hide();
        }
    }
}
</script>

<style scoped>
.p-confirm-popup {
    margin-top: 8px;
    border: 0 none;
    border-radius: 10px;
    box-shadow: 0px 11px 15px -7px rgba(0, 0, 0, 0.2), 0px 24px 38px 3px rgba(0, 0, 0, 0.14), 0px 9px 46px 8px rgba(0, 0, 0, 0.12);
    box-sizing: border-box;
}

.p-confirm-popup-content {
    padding: 1rem;
}

.p-confirm-popup-footer {
    display: flex;
    justify-content: flex-end;
    padding: 0.5rem 1rem;
    gap: 0.5rem;
}

.p-button {
    font-size: 14px;
    padding: 0.5rem 0.75rem;
    border-radius: 8px;
    cursor: pointer;
}

.p-confirm-popup-reject {
    /* Additional styles for the reject button */
}

.p-confirm-popup-accept {
    /* Additional styles for the accept button */
}
</style>
