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
			<!-- 蛋白质结构装饰 -->
			<div class="protein-decoration protein-helix">
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
			
			<div class="enzyme-decoration enzyme-1">
				<svg viewBox="0 0 100 100" class="enzyme-svg">
					<ellipse cx="50" cy="50" rx="40" ry="25" fill="none" stroke="currentColor" stroke-width="2" opacity="0.4"/>
					<circle cx="50" cy="50" r="15" fill="currentColor" opacity="0.2"/>
					<circle cx="35" cy="45" r="4" fill="currentColor" opacity="0.6"/>
					<circle cx="65" cy="55" r="4" fill="currentColor" opacity="0.6"/>
					<circle cx="50" cy="65" r="3" fill="currentColor" opacity="0.5"/>
				</svg>
			</div>

			<div class="enzyme-decoration enzyme-2">
				<svg viewBox="0 0 100 100" class="enzyme-svg active-site">
					<path d="M20 50 Q35 30 50 50 Q65 70 80 50" fill="none" stroke="currentColor" stroke-width="2.5" opacity="0.5"/>
					<circle cx="50" cy="50" r="8" fill="currentColor" opacity="0.3"/>
					<circle cx="35" cy="40" r="5" fill="currentColor" opacity="0.4"/>
					<circle cx="65" cy="60" r="5" fill="currentColor" opacity="0.4"/>
					<line x1="50" y1="50" x2="35" y2="40" stroke="currentColor" stroke-width="1.5" opacity="0.3"/>
					<line x1="50" y1="50" x2="65" y2="60" stroke="currentColor" stroke-width="1.5" opacity="0.3"/>
				</svg>
			</div>
			
			<div class="login-left-logo">
				<div class="logo-icon-wrapper">
					<div class="logo-icon">
						<!-- 酶结构SVG图标 -->
						<svg viewBox="0 0 200 200" class="enzyme-icon">
							<defs>
								<linearGradient id="enzymeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
									<stop offset="0%" style="stop-color:#1e40af;stop-opacity:1" />
									<stop offset="100%" style="stop-color:#1e3a8a;stop-opacity:1" />
								</linearGradient>
								<radialGradient id="activeSiteGradient" cx="50%" cy="50%" r="50%">
									<stop offset="0%" style="stop-color:#1e3a8a;stop-opacity:0.9" />
									<stop offset="100%" style="stop-color:#1e40af;stop-opacity:0.7" />
								</radialGradient>
							</defs>
							<!-- 酶主体轮廓 -->
							<ellipse cx="100" cy="100" rx="75" ry="50" fill="none" stroke="url(#enzymeGradient)" stroke-width="4" opacity="0.95"/>
							<!-- 活性位点 -->
							<circle cx="100" cy="100" r="25" fill="url(#activeSiteGradient)" opacity="0.85"/>
							<!-- 结合位点标记 -->
							<circle cx="70" cy="85" r="8" fill="#1e40af" opacity="0.8">
								<animate attributeName="r" values="8;10;8" dur="2s" repeatCount="indefinite"/>
								<animate attributeName="opacity" values="0.8;1;0.8" dur="2s" repeatCount="indefinite"/>
							</circle>
							<circle cx="130" cy="115" r="8" fill="#1e3a8a" opacity="0.8">
								<animate attributeName="r" values="8;10;8" dur="2.5s" repeatCount="indefinite"/>
								<animate attributeName="opacity" values="0.8;1;0.8" dur="2.5s" repeatCount="indefinite"/>
							</circle>
							<circle cx="100" cy="125" r="6" fill="#1e40af" opacity="0.7">
								<animate attributeName="r" values="6;8;6" dur="3s" repeatCount="indefinite"/>
								<animate attributeName="opacity" values="0.7;0.9;0.7" dur="3s" repeatCount="indefinite"/>
							</circle>
							<!-- 连接线 -->
							<line x1="100" y1="100" x2="70" y2="85" stroke="#1e40af" stroke-width="2.5" opacity="0.6"/>
							<line x1="100" y1="100" x2="130" y2="115" stroke="#1e3a8a" stroke-width="2.5" opacity="0.6"/>
							<line x1="100" y1="100" x2="100" y2="125" stroke="#1e40af" stroke-width="2.5" opacity="0.6"/>
							<!-- 表面纹理 -->
							<path d="M40 80 Q60 70 80 80" fill="none" stroke="url(#enzymeGradient)" stroke-width="2.5" opacity="0.5"/>
							<path d="M120 120 Q140 130 160 120" fill="none" stroke="url(#enzymeGradient)" stroke-width="2.5" opacity="0.5"/>
						</svg>
					</div>
				</div>
				<div class="login-left-logo-text">
					<h1 class="brand-title">
						<span class="title-chinese">酶优化计算平台</span>
					</h1>
					<p class="brand-subtitle">
						Enzyme Optimization Computing Platform
					</p>
					<div class="feature-tags">
						<span class="feature-tag">
							<svg class="tag-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
							</svg>
							AI预测
						</span>
						<span class="feature-tag">
							<svg class="tag-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<path d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/>
							</svg>
							酶工程
						</span>
						<span class="feature-tag">
							<svg class="tag-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<path d="M13 10V3L4 14h7v7l9-11h-7z"/>
							</svg>
							高效优化
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
			background: radial-gradient(circle, rgba(59, 130, 246, 0.25) 0%, transparent 70%);
			top: -200px;
			right: -100px;
			animation-delay: 0s;
		}

		&.orb-2 {
			width: 500px;
			height: 500px;
			background: radial-gradient(circle, rgba(30, 64, 175, 0.2) 0%, transparent 70%);
			bottom: -150px;
			left: -100px;
			animation-delay: -7s;
		}

		&.orb-3 {
			width: 400px;
			height: 400px;
			background: radial-gradient(circle, rgba(37, 99, 235, 0.15) 0%, transparent 70%);
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
		background: linear-gradient(135deg, #1e40af, #3b82f6);
		border-radius: 50%;
		pointer-events: none;
		box-shadow: 0 0 6px rgba(30, 64, 175, 0.4);
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

		// 蛋白质螺旋结构装饰
		.protein-decoration {
			position: absolute;
			color: rgba(30, 58, 138, 0.15);
			pointer-events: none;
			z-index: 1;

			.protein-svg {
				width: 100%;
				height: 100%;
			}

			&.protein-helix {
				width: 200px;
				height: 400px;
				top: 5%;
				left: 3%;
				animation: float-slow 25s ease-in-out infinite;
			}
		}

		// 酶活性位点装饰
		.enzyme-decoration {
			position: absolute;
			color: rgba(30, 64, 175, 0.18);
			pointer-events: none;
			z-index: 1;

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

				.active-site {
					animation: rotate-slow 30s linear infinite reverse;
				}
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
					background: radial-gradient(circle, rgba(30, 64, 175, 0.12) 0%, transparent 70%);
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

				.enzyme-icon {
					width: 180px;
					height: 180px;
					filter: drop-shadow(0 10px 30px rgba(30, 64, 175, 0.35));
					transition: transform 0.3s ease;

					&:hover {
						transform: scale(1.05) rotate(5deg);
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
@keyframes float-slow {
	0%, 100% {
		transform: translateY(0px) rotate(0deg);
	}
	50% {
		transform: translateY(-20px) rotate(5deg);
	}
}

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