<template>
    <div class="toast-container">
        <transition-group name="toast-fade" tag="div">
            <div v-for="(toast, index) in toasts" :key="toast.id" :class="['toast', toast.type]"
                @mouseenter="pauseTimer(toast.id)" @mouseleave="resumeTimer(toast.id)">
                <font-awesome-icon :icon="toast.iconClass" class="toast-icon" />
                <p>{{ toast.message }}</p>
                <font-awesome-icon icon="times" class="toast-close" @click="hideToast(toast.id)" />
                <div class="toast-timer" :class="toast.type" :style="toast.timerStyle"></div>
            </div>
        </transition-group>
    </div>
</template>

<script>
export default {
    name: 'ToastContainer',
    data() {
        return {
            toasts: [],
            toastId: 0
        };
    },
    methods: {
        showToast(message, type = 'success') {
            const id = this.toastId++;
            const toast = {
                id,
                message,
                type,
                visible: true,
                timerDuration: 3000,
                timerRemaining: 3000,
                startTime: null,
                iconClass: this.getIconClass(type),
                timer: null,
                timerStyle: {}
            };
            this.toasts.push(toast);
            this.$nextTick(() => {
                this.setTimerAnimation(toast.id);
                this.startTimer(toast.id);
            });
        },
        hideToast(id) {
            const index = this.toasts.findIndex(toast => toast.id === id);
            if (index !== -1) {
                this.toasts.splice(index, 1);
            }
        },
        startTimer(id) {
            const toast = this.toasts.find(toast => toast.id === id);
            if (toast) {
                toast.startTime = Date.now();
                toast.timer = setTimeout(() => this.hideToast(id), toast.timerRemaining);
            }
        },
        clearTimer(id) {
            const toast = this.toasts.find(toast => toast.id === id);
            if (toast && toast.timer) {
                clearTimeout(toast.timer);
                toast.timer = null;
            }
        },
        setTimerAnimation(id) {
            const toast = this.toasts.find(toast => toast.id === id);
            if (toast) {
                toast.timerStyle = {
                    animationDuration: `${toast.timerRemaining}ms`,
                    animationPlayState: 'running'
                };
            }
        },
        pauseTimer(id) {
            const toast = this.toasts.find(toast => toast.id === id);
            if (toast) {
                this.clearTimer(id);
                toast.timerRemaining -= Date.now() - toast.startTime;
                toast.timerStyle.animationPlayState = 'paused';
            }
        },
        resumeTimer(id) {
            const toast = this.toasts.find(toast => toast.id === id);
            if (toast) {
                toast.startTime = Date.now();
                toast.timer = setTimeout(() => this.hideToast(id), toast.timerRemaining);
                toast.timerStyle.animationPlayState = 'running';
            }
        },
        getIconClass(type) {
            switch (type) {
                case 'success':
                    return 'check-circle';
                case 'error':
                    return 'exclamation-triangle';
                case 'info':
                    return 'info-circle';
                case 'warning':
                    return 'exclamation-circle';
                default:
                    return '';
            }
        }
    }
};
</script>

<style scoped>
.toast-container {
    position: fixed;
    z-index: 1000;
    top: 20px;
    right: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.toast {
    padding: 15px 40px;
    background-color: #333;
    color: #fff;
    border-radius: 5px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    opacity: 0.9;
    transition: opacity 0.3s ease, transform 0.3s ease;
    display: flex;
    align-items: center;
    position: relative;
    margin-bottom: 10px;
}

.toast-icon {
    margin-right: 10px;
}

.toast-close {
    margin-left: auto;
    cursor: pointer;
    padding: 0.5rem;
}

.toast.success {
    background-color: #4caf50;
}

.toast.error {
    background-color: #f44336;
}

.toast.info {
    background-color: #2196f3;
}

.toast.warning {
    background-color: #ff9800;
}

.toast-fade-enter-active,
.toast-fade-leave-active {
    transition: opacity 0.5s, transform 0.5s;
}

.toast-fade-enter,
.toast-fade-leave-to {
    opacity: 0;
    transform: translateY(-20px);
}

.toast-fade-enter-to,
.toast-fade-leave {
    opacity: 1;
    transform: translateY(0);
}

.toast-timer {
    height: 4px;
    width: 100%;
    background-color: rgba(255, 255, 255, 0.5);
    position: absolute;
    bottom: 0;
    left: 0;
    animation: shrink linear forwards;
}

@keyframes shrink {
    from {
        width: 100%;
    }

    to {
        width: 0;
    }
}
</style>