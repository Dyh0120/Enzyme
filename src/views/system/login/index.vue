<template>
	<div class="login-container flex z-10">
		<!-- 动态背景层 -->
		<div class="dynamic-background">
			<!-- 蛋白质螺旋结构 -->
			<div class="protein-helix protein-1">
				<svg viewBox="0 0 200 400" class="protein-svg">
					<path d="M50 20 Q80 60 50 100 Q20 140 50 180 Q80 220 50 260 Q20 300 50 340 Q80 380 50 400" 
						  fill="none" stroke="currentColor" stroke-width="3" opacity="0.3"/>
					<path d="M150 20 Q120 60 150 100 Q180 140 150 180 Q120 220 150 260 Q180 300 150 340 Q120 380 150 400" 
						  fill="none" stroke="currentColor" stroke-width="3" opacity="0.3"/>
					<line x1="50" y1="60" x2="150" y2="60" stroke="currentColor" stroke-width="2" opacity="0.2"/>
					<line x1="50" y1="140" x2="150" y2="140" stroke="currentColor" stroke-width="2" opacity="0.2"/>
					<line x1="50" y1="220" x2="150" y2="220" stroke="currentColor" stroke-width="2" opacity="0.2"/>
					<line x1="50" y1="300" x2="150" y2="300" stroke="currentColor" stroke-width="2" opacity="0.2"/>
					<circle cx="50" cy="60" r="6" fill="currentColor" opacity="0.5"/>
					<circle cx="150" cy="60" r="6" fill="currentColor" opacity="0.5"/>
					<circle cx="50" cy="140" r="6" fill="currentColor" opacity="0.5"/>
					<circle cx="150" cy="140" r="6" fill="currentColor" opacity="0.5"/>
					<circle cx="50" cy="220" r="6" fill="currentColor" opacity="0.5"/>
					<circle cx="150" cy="220" r="6" fill="currentColor" opacity="0.5"/>
					<circle cx="50" cy="300" r="6" fill="currentColor" opacity="0.5"/>
					<circle cx="150" cy="300" r="6" fill="currentColor" opacity="0.5"/>
				</svg>
			</div>

			<div class="protein-helix protein-2">
				<svg viewBox="0 0 200 400" class="protein-svg">
					<path d="M50 20 Q80 60 50 100 Q20 140 50 180 Q80 220 50 260 Q20 300 50 340 Q80 380 50 400" 
						  fill="none" stroke="currentColor" stroke-width="3" opacity="0.25"/>
					<path d="M150 20 Q120 60 150 100 Q180 140 150 180 Q120 220 150 260 Q180 300 150 340 Q120 380 150 400" 
						  fill="none" stroke="currentColor" stroke-width="3" opacity="0.25"/>
					<line x1="50" y1="60" x2="150" y2="60" stroke="currentColor" stroke-width="2" opacity="0.15"/>
					<line x1="50" y1="140" x2="150" y2="140" stroke="currentColor" stroke-width="2" opacity="0.15"/>
					<line x1="50" y1="220" x2="150" y2="220" stroke="currentColor" stroke-width="2" opacity="0.15"/>
					<line x1="50" y1="300" x2="150" y2="300" stroke="currentColor" stroke-width="2" opacity="0.15"/>
				</svg>
			</div>

			<!-- 酶活性位点 -->
			<div class="enzyme-site enzyme-1">
				<svg viewBox="0 0 100 100" class="enzyme-svg">
					<ellipse cx="50" cy="50" rx="40" ry="25" fill="none" stroke="currentColor" stroke-width="2" opacity="0.4"/>
					<circle cx="50" cy="50" r="15" fill="currentColor" opacity="0.2"/>
					<circle cx="35" cy="45" r="4" fill="currentColor" opacity="0.6"/>
					<circle cx="65" cy="55" r="4" fill="currentColor" opacity="0.6"/>
					<circle cx="50" cy="65" r="3" fill="currentColor" opacity="0.5"/>
				</svg>
			</div>

			<div class="enzyme-site enzyme-2">
				<svg viewBox="0 0 100 100" class="enzyme-svg">
					<path d="M20 50 Q35 30 50 50 Q65 70 80 50" fill="none" stroke="currentColor" stroke-width="2.5" opacity="0.5"/>
					<circle cx="50" cy="50" r="8" fill="currentColor" opacity="0.3"/>
					<circle cx="35" cy="40" r="5" fill="currentColor" opacity="0.4"/>
					<circle cx="65" cy="60" r="5" fill="currentColor" opacity="0.4"/>
					<line x1="50" y1="50" x2="35" y2="40" stroke="currentColor" stroke-width="1.5" opacity="0.3"/>
					<line x1="50" y1="50" x2="65" y2="60" stroke="currentColor" stroke-width="1.5" opacity="0.3"/>
				</svg>
			</div>

			<!-- 浮动粒子 -->
			<div
				v-for="particle in particles"
				:key="particle.id"
				class="particle"
				:style="{
					left: `${particle.x}%`,
					top: `${particle.y}%`,
					opacity: particle.opacity,
					transform: `scale(${particle.size})`
				}">
			</div>
		</div>

		<div class="login-left">
			<!-- Logo区域已隐藏 -->
		</div>
		<div class="login-right flex z-10">
			<div class="login-right-warp flex-margin">
				<div class="login-right-warp-mian">
					<div class="login-right-warp-main-title">
						<span class="welcome-text">{{ userInfos.pwd_change_count===0 ? '初次登录修改密码' : '酶优化平台' }}</span>
					</div>
					<div class="login-right-warp-main-form">
						<div v-if="!state.isScan">
							<el-tabs v-model="state.tabsActiveName">
								<el-tab-pane label="密码修改" name="changePwd" v-if="userInfos.pwd_change_count===0">
									<ChangePwd />
								</el-tab-pane>

								<el-tab-pane label="账号密码登录" name="account" v-else>
									<Account />
								</el-tab-pane>
							</el-tabs>
						</div>
						<OAuth2 />
					</div>
				</div>
			</div>
		</div>
		<img v-if="loginBg" :src="loginBg" class="loginBg fixed inset-0 z-1 w-full h-full" />
	</div>
</template>

<script setup lang="ts" name="loginIndex">
import {defineAsyncComponent, onMounted, onUnmounted, reactive, computed, watch, ref} from 'vue';
import { storeToRefs } from 'pinia';
import { useThemeConfig } from '/@/stores/themeConfig';
import { NextLoading } from '/@/utils/loading';
import logoMini from '/@/assets/logo-mini.svg';
import loginMain from '/@/assets/login-main.svg';
import loginBg from '/@/assets/login-bg.png';
import { SystemConfigStore } from '/@/stores/systemConfig'
import { getBaseURL } from "/@/utils/baseUrl";
// 引入组件
const Account = defineAsyncComponent(() => import('/@/views/system/login/component/account.vue'));
const Mobile = defineAsyncComponent(() => import('/@/views/system/login/component/mobile.vue'));
const Scan = defineAsyncComponent(() => import('/@/views/system/login/component/scan.vue'));
const ChangePwd = defineAsyncComponent(() => import('/@/views/system/login/component/changePwd.vue'));
const OAuth2 = defineAsyncComponent(() => import('/@/views/system/login/component/oauth2.vue'));

import _ from "lodash-es";
import {useUserInfo} from "/@/stores/userInfo";
const { userInfos } = storeToRefs(useUserInfo());

// 定义变量内容
const storesThemeConfig = useThemeConfig();
const { themeConfig } = storeToRefs(storesThemeConfig);
const state = reactive({
	tabsActiveName: 'account',
	isScan: false,
});


watch(()=>userInfos.value.pwd_change_count,(val)=>{
  if(val===0){
    state.tabsActiveName ='changePwd'
  }else{
    state.tabsActiveName ='account'
  }
},{deep:true,immediate:true})


// 获取布局配置信息
const getThemeConfig = computed(() => {
	return themeConfig.value;
});

const systemConfigStore = SystemConfigStore()
const { systemConfig } = storeToRefs(systemConfigStore)
const getSystemConfig = computed(() => {
	return systemConfig.value
})

const siteLogo = computed(() => {
	if (!_.isEmpty(getSystemConfig.value['login.site_logo'])) {
		return getSystemConfig.value['login.site_logo']
	}
	return logoMini
});

const siteBg = computed(() => {
	if (!_.isEmpty(getSystemConfig.value['login.login_background'])) {
		return getSystemConfig.value['login.login_background']
	}
});

// 粒子动画
const particles = ref<Array<{id: number, x: number, y: number, size: number, speed: number, opacity: number}>>([]);
let animationFrameId: any = null;

const generateParticles = () => {
	const newParticles = [];
	for (let i = 0; i < 30; i++) {
		newParticles.push({
			id: i,
			x: Math.random() * 100,
			y: Math.random() * 100,
			size: Math.random() * 2 + 0.5,
			speed: Math.random() * 0.08 + 0.02,
			opacity: Math.random() * 0.4 + 0.1
		});
	}
	particles.value = newParticles;
}

const updateParticles = () => {
	particles.value = particles.value.map(particle => ({
		...particle,
		y: particle.y - particle.speed,
		x: particle.x + Math.sin(particle.y * 0.01) * 0.2,
		...(particle.y < -5 ? { y: 105, x: Math.random() * 100 } : {})
	}));
	animationFrameId = requestAnimationFrame(updateParticles);
}

// 页面加载时
onMounted(() => {
	NextLoading.done();
	generateParticles();
	animationFrameId = requestAnimationFrame(updateParticles);
});

onUnmounted(() => {
	if (animationFrameId) {
		cancelAnimationFrame(animationFrameId);
	}
});
</script>

<style scoped lang="scss">
.login-container {
	height: 100%;
	background: var(--el-color-white);

	// 动态背景层
	.dynamic-background {
		position: fixed;
		inset: 0;
		z-index: 2;
		pointer-events: none;
		overflow: hidden;
	}

	// 蛋白质螺旋结构
	.protein-helix {
		position: absolute;
		color: rgba(30, 64, 175, 0.15);
		pointer-events: none;

		.protein-svg {
			width: 100%;
			height: 100%;
		}

		&.protein-1 {
			width: 200px;
			height: 400px;
			top: 5%;
			left: 3%;
			animation: float-slow 25s ease-in-out infinite;
		}

		&.protein-2 {
			width: 180px;
			height: 360px;
			bottom: 10%;
			right: 5%;
			animation: float-slow 30s ease-in-out infinite reverse;
		}
	}

	// 酶活性位点
	.enzyme-site {
		position: absolute;
		color: rgba(30, 64, 175, 0.18);
		pointer-events: none;

		.enzyme-svg {
			width: 100%;
			height: 100%;
		}

		&.enzyme-1 {
			width: 160px;
			height: 160px;
			bottom: 15%;
			right: 8%;
			animation: rotate-slow 35s linear infinite;
		}

		&.enzyme-2 {
			width: 140px;
			height: 140px;
			top: 55%;
			left: 6%;
			animation: pulse-gentle 5s ease-in-out infinite;
		}
	}

	// 浮动粒子
	.particle {
		position: absolute;
		width: 3px;
		height: 3px;
		background: linear-gradient(135deg, #1e40af, #3b82f6);
		border-radius: 50%;
		pointer-events: none;
		box-shadow: 0 0 6px rgba(30, 64, 175, 0.4);
	}

	.login-left {
		flex: 1;
		position: relative;
		background-color: rgba(211, 239, 255, 1);
		margin-right: 100px;

		// Logo区域已隐藏

		.login-left-img {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			width: 100%;
			height: 52%;

			img {
				width: 100%;
				height: 100%;
				animation: error-num 0.6s ease;
			}
		}

		.login-left-waves {
			position: absolute;
			top: 0;
			right: -100px;
		}
	}

	.login-right {
		width: 700px;

		.login-right-warp {
			border-radius: 16px;
			width: 500px;
			height: 500px;
			position: relative;
			overflow: hidden;
			background: #ffffff;
			box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04);
			border: 1px solid rgba(226, 232, 240, 0.8);

			.login-right-warp-one,
			.login-right-warp-two {
				position: absolute;
				display: block;
				width: inherit;
				height: inherit;

				&::before,
				&::after {
					content: '';
					position: absolute;
					z-index: 1;
				}
			}

			.login-right-warp-one {
				&::before {
					filter: hue-rotate(0deg);
					top: 0px;
					left: 0;
					width: 100%;
					height: 3px;
					background: linear-gradient(90deg, transparent, var(--el-color-primary));
					animation: loginLeft 3s linear infinite;
				}

				&::after {
					filter: hue-rotate(60deg);
					top: -100%;
					right: 2px;
					width: 3px;
					height: 100%;
					background: linear-gradient(180deg, transparent, var(--el-color-primary));
					animation: loginTop 3s linear infinite;
					animation-delay: 0.7s;
				}
			}

			.login-right-warp-two {
				&::before {
					filter: hue-rotate(120deg);
					bottom: 2px;
					right: -100%;
					width: 100%;
					height: 3px;
					background: linear-gradient(270deg, transparent, var(--el-color-primary));
					animation: loginRight 3s linear infinite;
					animation-delay: 1.4s;
				}

				&::after {
					filter: hue-rotate(300deg);
					bottom: -100%;
					left: 0px;
					width: 3px;
					height: 100%;
					background: linear-gradient(360deg, transparent, var(--el-color-primary));
					animation: loginBottom 3s linear infinite;
					animation-delay: 2.1s;
				}
			}

			.login-right-warp-mian {
				display: flex;
				flex-direction: column;
				height: 100%;

				.login-right-warp-main-title {
					height: 130px;
					display: flex;
					align-items: center;
					justify-content: center;
					font-size: 28px;
					font-weight: 700;
					text-align: center;
					letter-spacing: 2px;
					animation: fadeInUp 0.6s ease;
					color: var(--el-text-color-primary);

					.welcome-text {
						background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 50%, #3b82f6 100%);
						-webkit-background-clip: text;
						-webkit-text-fill-color: transparent;
						background-clip: text;
						filter: drop-shadow(0 2px 4px rgba(30, 64, 175, 0.2));
					}
				}

				.login-right-warp-main-form {
					flex: 1;
					padding: 0 50px 50px;

					.login-content-main-sacn {
						position: absolute;
						top: 2px;
						right: 12px;
						width: 50px;
						height: 50px;
						overflow: hidden;
						cursor: pointer;
						transition: all ease 0.3s;
						color: var(--el-color-primary);

						&-delta {
							position: absolute;
							width: 35px;
							height: 70px;
							z-index: 2;
							top: 2px;
							right: 21px;
							background: var(--el-color-white);
							transform: rotate(-45deg);
						}

						&:hover {
							opacity: 1;
							transition: all ease 0.3s;
							color: var(--el-color-primary) !important;
						}

						i {
							width: 47px;
							height: 50px;
							display: inline-block;
							font-size: 48px;
							position: absolute;
							right: 1px;
							top: 0px;
						}
					}
				}
			}
		}
	}

	.login-authorization {
		position: absolute;
		bottom: 30px;
		left: 0;
		right: 0;
		text-align: center;

		p {
			font-size: 12px;
			color: rgba(0, 0, 0, 0.5);
		}

		a {
			color: var(--el-color-primary);
			margin: 0 5px;
		}
	}
}

@keyframes logoAnimation {
	0% {
		transform: scale(0);
	}
	80% {
		transform: scale(1.2);
	}
	100% {
		transform: scale(1);
	}
}

@keyframes loginLeft {
	0% {
		left: -100%;
	}
	50%, 100% {
		left: 100%;
	}
}

@keyframes loginTop {
	0% {
		top: -100%;
	}
	50%, 100% {
		top: 100%;
	}
}

@keyframes loginRight {
	0% {
		right: -100%;
	}
	50%, 100% {
		right: 100%;
	}
}

@keyframes loginBottom {
	0% {
		bottom: -100%;
	}
	50%, 100% {
		bottom: 100%;
	}
}

@keyframes fadeInUp {
	from {
		opacity: 0;
		transform: translateY(20px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

@keyframes float-slow {
	0%, 100% {
		transform: translateY(0px) rotate(0deg);
	}
	50% {
		transform: translateY(-20px) rotate(5deg);
	}
}

@keyframes rotate-slow {
	from {
		transform: rotate(0deg);
	}
	to {
		transform: rotate(360deg);
	}
}

@keyframes pulse-gentle {
	0%, 100% {
		opacity: 0.15;
		transform: scale(1);
	}
	50% {
		opacity: 0.25;
		transform: scale(1.05);
	}
}
</style>
