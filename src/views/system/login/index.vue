<template>
	<div class="login-container flex z-10">
		<!-- 动态背景层 -->
		<div class="ambient-background">
			<div class="gradient-orb orb-1"></div>
			<div class="gradient-orb orb-2"></div>
			<div class="gradient-orb orb-3"></div>
		</div>

		<!-- 网格背景 -->
		<div class="grid-background">
			<div class="grid-pattern"></div>
		</div>

		<!-- 浮动粒子 -->
		<div class="particles-container">
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
			<!-- 分子结构装饰 -->
			<div class="molecule-decoration molecule-1">
				<svg viewBox="0 0 100 100" class="molecule-svg">
					<circle cx="50" cy="50" r="8" fill="currentColor" opacity="0.8"/>
					<circle cx="20" cy="30" r="5" fill="currentColor" opacity="0.6"/>
					<circle cx="80" cy="30" r="5" fill="currentColor" opacity="0.6"/>
					<circle cx="20" cy="70" r="5" fill="currentColor" opacity="0.6"/>
					<circle cx="80" cy="70" r="5" fill="currentColor" opacity="0.6"/>
					<line x1="50" y1="50" x2="20" y2="30" stroke="currentColor" stroke-width="1.5" opacity="0.4"/>
					<line x1="50" y1="50" x2="80" y2="30" stroke="currentColor" stroke-width="1.5" opacity="0.4"/>
					<line x1="50" y1="50" x2="20" y2="70" stroke="currentColor" stroke-width="1.5" opacity="0.4"/>
					<line x1="50" y1="50" x2="80" y2="70" stroke="currentColor" stroke-width="1.5" opacity="0.4"/>
				</svg>
			</div>
			
			<div class="molecule-decoration molecule-2">
				<svg viewBox="0 0 100 100" class="molecule-svg">
					<circle cx="30" cy="50" r="6" fill="currentColor" opacity="0.7"/>
					<circle cx="70" cy="50" r="6" fill="currentColor" opacity="0.7"/>
					<circle cx="50" cy="20" r="4" fill="currentColor" opacity="0.5"/>
					<circle cx="50" cy="80" r="4" fill="currentColor" opacity="0.5"/>
					<line x1="30" y1="50" x2="70" y2="50" stroke="currentColor" stroke-width="2" opacity="0.4"/>
					<line x1="30" y1="50" x2="50" y2="20" stroke="currentColor" stroke-width="1.5" opacity="0.3"/>
					<line x1="30" y1="50" x2="50" y2="80" stroke="currentColor" stroke-width="1.5" opacity="0.3"/>
					<line x1="70" y1="50" x2="50" y2="20" stroke="currentColor" stroke-width="1.5" opacity="0.3"/>
					<line x1="70" y1="50" x2="50" y2="80" stroke="currentColor" stroke-width="1.5" opacity="0.3"/>
				</svg>
			</div>

			<div class="molecule-decoration molecule-3">
				<svg viewBox="0 0 100 100" class="molecule-svg hexagon">
					<polygon points="50,10 90,30 90,70 50,90 10,70 10,30" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.3"/>
					<circle cx="50" cy="50" r="5" fill="currentColor" opacity="0.6"/>
					<circle cx="50" cy="10" r="3" fill="currentColor" opacity="0.4"/>
					<circle cx="90" cy="30" r="3" fill="currentColor" opacity="0.4"/>
					<circle cx="90" cy="70" r="3" fill="currentColor" opacity="0.4"/>
					<circle cx="50" cy="90" r="3" fill="currentColor" opacity="0.4"/>
					<circle cx="10" cy="70" r="3" fill="currentColor" opacity="0.4"/>
					<circle cx="10" cy="30" r="3" fill="currentColor" opacity="0.4"/>
				</svg>
			</div>
			
			<div class="login-left-logo">
				<div class="logo-icon-wrapper">
					<div class="logo-icon">
						<!-- 烧瓶SVG图标替代emoji -->
						<svg viewBox="0 0 120 140" class="flask-icon">
							<defs>
								<linearGradient id="flaskGradient" x1="0%" y1="0%" x2="100%" y2="100%">
									<stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
									<stop offset="100%" style="stop-color:#1e40af;stop-opacity:1" />
								</linearGradient>
								<linearGradient id="liquidGradient" x1="0%" y1="0%" x2="0%" y2="100%">
									<stop offset="0%" style="stop-color:#60a5fa;stop-opacity:0.8" />
									<stop offset="100%" style="stop-color:#3b82f6;stop-opacity:0.9" />
								</linearGradient>
							</defs>
							<!-- 烧瓶颈部 -->
							<path d="M45 5 L45 50 L20 110 Q15 125 30 130 L90 130 Q105 125 100 110 L75 50 L75 5 Z" 
								  fill="none" stroke="url(#flaskGradient)" stroke-width="3" opacity="0.9"/>
							<!-- 烧瓶口 -->
							<ellipse cx="60" cy="5" rx="15" ry="4" fill="none" stroke="url(#flaskGradient)" stroke-width="3"/>
							<!-- 液体 -->
							<path d="M25 115 Q22 122 30 125 L90 125 Q98 122 95 115 L85 85 L35 85 Z" 
								  fill="url(#liquidGradient)"/>
							<!-- 气泡 -->
							<circle cx="45" cy="100" r="3" fill="white" opacity="0.6">
								<animate attributeName="cy" values="100;75;100" dur="3s" repeatCount="indefinite"/>
								<animate attributeName="opacity" values="0.6;0;0.6" dur="3s" repeatCount="indefinite"/>
							</circle>
							<circle cx="60" cy="95" r="2.5" fill="white" opacity="0.5">
								<animate attributeName="cy" values="95;70;95" dur="2.5s" repeatCount="indefinite"/>
								<animate attributeName="opacity" values="0.5;0;0.5" dur="2.5s" repeatCount="indefinite"/>
							</circle>
							<circle cx="75" cy="105" r="2" fill="white" opacity="0.4">
								<animate attributeName="cy" values="105;80;105" dur="3.5s" repeatCount="indefinite"/>
								<animate attributeName="opacity" values="0.4;0;0.4" dur="3.5s" repeatCount="indefinite"/>
							</circle>
						</svg>
					</div>
				</div>
				<div class="login-left-logo-text">
					<h1 class="brand-title">
						<span class="title-chinese">化学逆合成管理系统</span>
					</h1>
					<p class="brand-subtitle">
						Chemical Retrosynthesis Management System
					</p>
					<div class="feature-tags">
						<span class="feature-tag">
							<svg class="tag-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
							</svg>
							AI驱动
						</span>
						<span class="feature-tag">
							<svg class="tag-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
							</svg>
							智能分析
						</span>
						<span class="feature-tag">
							<svg class="tag-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<path d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"/>
							</svg>
							逆合成
						</span>
					</div>
				</div>
			</div>
		</div>
		
		<div class="login-right flex z-10">
			<div class="login-right-warp flex-margin">
				<div class="login-right-warp-mian">
					<div class="login-right-warp-main-title">
						{{userInfos.pwd_change_count===0?'初次登录修改密码':'欢迎登录'}}
					</div>
					<div class="login-right-warp-main-form">
						<div v-if="!state.isScan">
							<el-tabs v-model="state.tabsActiveName">
								<el-tab-pane :label="$t('message.label.changePwd')" name="changePwd" v-if="userInfos.pwd_change_count===0">
									<ChangePwd />
								</el-tab-pane>
								<el-tab-pane :label="$t('message.label.one1')" name="account" v-else>
									<Account />
								</el-tab-pane>
							</el-tabs>
						</div>
						<OAuth2 />
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts" name="loginIndex">
import {defineAsyncComponent, onMounted, onUnmounted, reactive, computed, watch, ref} from 'vue';
import { storeToRefs } from 'pinia';
import { useThemeConfig } from '/@/stores/themeConfig';
import { NextLoading } from '/@/utils/loading';
import logoMini from '/@/assets/logo-mini.svg';
import { SystemConfigStore } from '/@/stores/systemConfig'
import { getBaseURL } from "/@/utils/baseUrl";
import _ from "lodash-es";
import {useUserInfo} from "/@/stores/userInfo";

const Account = defineAsyncComponent(() => import('/@/views/system/login/component/account.vue'));
const Mobile = defineAsyncComponent(() => import('/@/views/system/login/component/mobile.vue'));
const Scan = defineAsyncComponent(() => import('/@/views/system/login/component/scan.vue'));
const ChangePwd = defineAsyncComponent(() => import('/@/views/system/login/component/changePwd.vue'));
const OAuth2 = defineAsyncComponent(() => import('/@/views/system/login/component/oauth2.vue'));

const { userInfos } = storeToRefs(useUserInfo());
const storesThemeConfig = useThemeConfig();
const { themeConfig } = storeToRefs(storesThemeConfig);
const state = reactive({
	tabsActiveName: 'account',
	isScan: false,
});

const particles = ref<Array<{id: number, x: number, y: number, size: number, speed: number, opacity: number}>>([]);
let particleInterval: any = null;
let animationFrameId: any = null;

const generateParticles = () => {
	const newParticles = [];
	for (let i = 0; i < 40; i++) {
		newParticles.push({
			id: i,
			x: Math.random() * 100,
			y: Math.random() * 100,
			size: Math.random() * 2 + 0.5,
			speed: Math.random() * 0.3 + 0.05,
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

watch(()=>userInfos.value.pwd_change_count,(val)=>{
	if(val===0){
		state.tabsActiveName ='changePwd'
	}else{
		state.tabsActiveName ='account'
	}
},{deep:true,immediate:true})

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
	background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%);
	position: relative;
	overflow: hidden;

	// 环境光背景
	.ambient-background {
		position: absolute;
		inset: 0;
		z-index: 0;
		overflow: hidden;
	}

	.gradient-orb {
		position: absolute;
		border-radius: 50%;
		filter: blur(80px);
		opacity: 0.4;
		animation: float-orb 20s ease-in-out infinite;

		&.orb-1 {
			width: 600px;
			height: 600px;
			background: radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%);
			top: -200px;
			right: -100px;
			animation-delay: 0s;
		}

		&.orb-2 {
			width: 500px;
			height: 500px;
			background: radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, transparent 70%);
			bottom: -150px;
			left: -100px;
			animation-delay: -7s;
		}

		&.orb-3 {
			width: 400px;
			height: 400px;
			background: radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, transparent 70%);
			top: 40%;
			left: 30%;
			animation-delay: -14s;
		}
	}

	// 网格背景
	.grid-background {
		position: absolute;
		inset: 0;
		z-index: 1;
		opacity: 0.03;

		.grid-pattern {
			position: absolute;
			inset: 0;
			background-image: 
				linear-gradient(rgba(30, 58, 138, 0.5) 1px, transparent 1px),
				linear-gradient(90deg, rgba(30, 58, 138, 0.5) 1px, transparent 1px);
			background-size: 80px 80px;
			mask-image: radial-gradient(ellipse at center, black 40%, transparent 80%);
		}
	}

	// 粒子容器
	.particles-container {
		position: absolute;
		inset: 0;
		overflow: hidden;
		z-index: 2;
		pointer-events: none;
	}

	.particle {
		position: absolute;
		width: 3px;
		height: 3px;
		background: linear-gradient(135deg, #3b82f6, #8b5cf6);
		border-radius: 50%;
		pointer-events: none;
		box-shadow: 0 0 6px rgba(59, 130, 246, 0.5);
	}

	.login-left {
		flex: 1;
		position: relative;
		background: transparent;
		margin-right: 80px;
		z-index: 10;
		display: flex;
		align-items: center;
		justify-content: center;
		padding-left: 10%;
		padding-right: 0%;
		
		@media (max-width: 1200px) {
			margin-right: 40px;
			padding-left: 5%;
			padding-right: 3%;
		}
		
		@media (max-width: 968px) {
			display: none;
		}

		// 分子结构装饰
		.molecule-decoration {
			position: absolute;
			color: rgba(59, 130, 246, 0.15);
			pointer-events: none;
			z-index: 1;

			.molecule-svg {
				width: 100%;
				height: 100%;
			}

			&.molecule-1 {
				width: 180px;
				height: 180px;
				top: 10%;
				left: 5%;
				animation: rotate-slow 30s linear infinite;
			}

			&.molecule-2 {
				width: 150px;
				height: 150px;
				bottom: 20%;
				right: 10%;
				animation: rotate-slow 25s linear infinite reverse;
			}

			&.molecule-3 {
				width: 120px;
				height: 120px;
				top: 60%;
				left: 8%;
				animation: pulse-gentle 4s ease-in-out infinite;
			}

			.hexagon {
				animation: rotate-slow 40s linear infinite;
			}
		}

		.login-left-logo {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			width: 100%;
			max-width: 600px;
			padding: 0 20px;
			animation: fadeIn 1s ease-out;
			position: relative;
			z-index: 2;

			.logo-icon-wrapper {
				margin-bottom: 40px;
				position: relative;

				&::before {
					content: '';
					position: absolute;
					inset: -20px;
					background: radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%);
					border-radius: 50%;
					animation: pulse-glow 3s ease-in-out infinite;
				}
			}

			.logo-icon {
				display: flex;
				align-items: center;
				justify-content: center;
				position: relative;
				animation: float-gentle 4s ease-in-out infinite;

				.flask-icon {
					width: 140px;
					height: 160px;
					filter: drop-shadow(0 10px 30px rgba(59, 130, 246, 0.3));
					transition: transform 0.3s ease;

					&:hover {
						transform: scale(1.05);
					}
				}
			}

			.login-left-logo-text {
				text-align: center;
				width: 100%;

				.brand-title {
					margin: 0 0 16px 0;
					
					.title-chinese {
						font-size: 48px;
						font-weight: 700;
						background: linear-gradient(135deg, #0f172a 0%, #1e40af 50%, #3b82f6 100%);
						background-clip: text;
						-webkit-background-clip: text;
						color: transparent;
						letter-spacing: 0.1em;
						display: block;
						line-height: 1.2;
						
						@media (max-width: 1400px) {
							font-size: 44px;
						}
						
						@media (max-width: 1200px) {
							font-size: 38px;
						}
					}
				}

				.brand-subtitle {
					font-size: 15px;
					color: #64748b;
					margin: 0 0 45px 0;
					line-height: 1.6;
					font-weight: 400;
					letter-spacing: 0.12em;
					text-transform: uppercase;
				}

				.feature-tags {
					display: flex;
					align-items: center;
					justify-content: center;
					gap: 16px;
					flex-wrap: wrap;
				}

				.feature-tag {
					display: flex;
					align-items: center;
					gap: 8px;
					padding: 10px 20px;
					background: rgba(255, 255, 255, 0.7);
					backdrop-filter: blur(10px);
					border: 1px solid rgba(59, 130, 246, 0.15);
					border-radius: 30px;
					color: #1e40af;
					font-size: 14px;
					font-weight: 500;
					transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
					box-shadow: 0 2px 10px rgba(59, 130, 246, 0.08);

					.tag-icon {
						width: 18px;
						height: 18px;
						stroke-width: 2;
					}

					&:hover {
						background: rgba(59, 130, 246, 0.08);
						border-color: rgba(59, 130, 246, 0.3);
						transform: translateY(-2px);
						box-shadow: 0 8px 25px rgba(59, 130, 246, 0.15);
					}
				}
			}
		}
	}

	.login-right {
		width: 700px;
		z-index: 10;

		.login-right-warp {
			border-radius: 12px;
			width: 500px;
			height: 500px;
			position: relative;
			overflow: hidden;
			background: rgba(255, 255, 255, 0.95);
			backdrop-filter: blur(8px);
			box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.08);
			border: 1px solid rgba(226, 232, 240, 0.6);

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
					line-height: 130px;
					font-size: 32px;
					font-weight: 600;
					text-align: center;
					letter-spacing: 3px;
					animation: logoAnimation 0.3s ease;
					animation-delay: 0.3s;
					background: linear-gradient(135deg, rgb(30, 41, 59) 0%, rgb(59, 130, 246) 100%);
					background-clip: text;
					-webkit-background-clip: text;
					color: transparent;
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
		z-index: 10;

		p {
			font-size: 14px;
			color: rgba(0, 0, 0, 0.5);
		}

		a {
			color: var(--el-color-primary);
			margin: 0 5px;
		}
	}
}

// 动画定义
@keyframes fadeIn {
	from {
		opacity: 0;
		transform: translateY(30px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

@keyframes float-gentle {
	0%, 100% {
		transform: translateY(0px);
	}
	50% {
		transform: translateY(-12px);
	}
}

@keyframes float-orb {
	0%, 100% {
		transform: translate(0, 0) scale(1);
	}
	33% {
		transform: translate(30px, -30px) scale(1.1);
	}
	66% {
		transform: translate(-20px, 20px) scale(0.9);
	}
}

@keyframes pulse-glow {
	0%, 100% {
		opacity: 0.5;
		transform: scale(1);
	}
	50% {
		opacity: 0.8;
		transform: scale(1.1);
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

@keyframes rotate-slow {
	from {
		transform: rotate(0deg);
	}
	to {
		transform: rotate(360deg);
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

// 响应式调整
@media (max-width: 1400px) {
	.login-container {
		.login-left {
			.login-left-logo {
				.logo-icon-wrapper {
					.flask-icon {
						width: 130px;
						height: 150px;
					}
				}
			}
		}
	}
}

@media (max-width: 1200px) {
	.login-container {
		.login-left {
			.login-left-logo {
				.logo-icon-wrapper {
					.flask-icon {
						width: 120px;
						height: 140px;
					}
				}
				
				.login-left-logo-text {
					.brand-title {
						margin: 0 0 12px 0;
					}
					
					.brand-subtitle {
						margin: 0 0 35px 0;
						font-size: 14px;
					}
				}
			}
		}
		
		.login-right {
			width: 500px;
			
			.login-right-warp {
				width: 420px;
			}
		}
	}
}

@media (max-width: 968px) {
	.login-container {
		.login-right {
			width: 100%;
			
			.login-right-warp {
				width: 90%;
				max-width: 500px;
				margin: 0 auto;
			}
		}
	}
}
</style>