const { createApp } = Vue;

createApp({
    data() {
        return {
            hero: { life: 100, name: "Herói", defending: false },
            villain: { life: 100, name: "Vilão", defending: false },
            gameOver: false,
            message: "",
            actionLog: [],
            showAllLogs: false,
            isMuted: false,
            volume: 0.5,  // Volume inicial
        };
    },
    mounted() {
        // Definir o volume inicial
        this.$refs.audio.volume = this.volume;

        // Tocar música automaticamente
        this.playMusic();

        // Listener para reproduzir música caso o autoplay seja bloqueado
        document.addEventListener('click', this.playMusic);
    },
    methods: {
        playMusic() {
            const audio = this.$refs.audio;
            if (audio.paused) {
                audio.play().then(() => {
                    document.removeEventListener('click', this.playMusic); // Remover listener após a primeira interação
                }).catch((error) => {
                    console.log('Autoplay bloqueado, aguardando interação do usuário...', error);
                });
            }
        },
        attack(isHero) {
            let attacker = isHero ? this.hero : this.villain;
            let defender = isHero ? this.villain : this.hero;

            const damage = Math.floor(Math.random() * 20) + 5;
            if (defender.defending) {
                defender.life -= damage / 2;
                defender.defending = false;
            } else {
                defender.life -= damage;
            }

            this.addActionToLog(isHero ? `Herói atacou e causou ${damage} de dano!` : `Vilão atacou e causou ${damage} de dano!`);
            this.checkHealth();
            if (isHero) this.villainAction();
        },
        defense(isHero) {
            if (isHero) {
                this.hero.defending = true;
                this.addActionToLog("Herói está defendendo!");
                this.villainAction();
            } else {
                this.villain.defending = true;
                this.addActionToLog("Vilão está defendendo!");
            }
        },
        usePotion(isHero) {
            let character = isHero ? this.hero : this.villain;
            const heal = Math.floor(Math.random() * 20) + 10;
            character.life += heal;
            if (character.life > 100) character.life = 100;

            this.addActionToLog(isHero ? `Herói usou uma poção e recuperou ${heal} de vida!` : `Vilão usou uma poção e recuperou ${heal} de vida!`);
            if (isHero) this.villainAction();
        },
        flee(isHero) {
            if (isHero) {
                this.addActionToLog("Herói fugiu!");
                this.endGame("Você fugiu! Derrota.");
            }
        },
        villainAction() {
            const actions = ['attack', 'defense', 'usePotion'];
            const randomAction = actions[Math.floor(Math.random() * actions.length)];
            this[randomAction](false);
        },
        checkHealth() {
            if (this.hero.life <= 0) {
                this.endGame("Você perdeu! O vilão venceu.");
            } else if (this.villain.life <= 0) {
                this.endGame("Você venceu! Parabéns.");
            }
        },
        addActionToLog(action) {
            this.actionLog.unshift(action);
        },
        endGame(message) {
            this.message = message;
            this.gameOver = true;
        },
        restartGame() {
            this.hero.life = 100;
            this.villain.life = 100;
            this.gameOver = false;
            this.hero.defending = false;
            this.villain.defending = false;
            this.actionLog = [];
        },
        toggleLogs() {
            this.showAllLogs = !this.showAllLogs;
        },
        toggleMute() {
            this.isMuted = !this.isMuted;
            this.$refs.audio.muted = this.isMuted;
        },
        adjustVolume() {
            this.$refs.audio.volume = this.volume;
        }
    },
    computed: {
        displayedLogs() {
            return this.showAllLogs ? this.actionLog : this.actionLog.slice(0, 2);
        }
    }
}).mount("#app");
