<template>
	<fs-page>
		<fs-crud ref="crudRef" v-bind="crudBinding">
			<template #header-title>
				<span>公告列表</span>
			</template>
		</fs-crud>
	</fs-page>
</template>

<script lang="ts" setup name="announcementView">
import { ref, onMounted } from 'vue';
import { useFs } from '@fast-crud/fast-crud';
import createCrudOptions from './crud';

// 初始化crud配置
const { crudRef, crudBinding, crudExpose } = useFs({ createCrudOptions });

// 页面打开后获取列表数据
onMounted(() => {
	crudExpose.doRefresh();
});
</script>

<style scoped lang="scss">
::v-deep(.fs-crud) {
	.fs-page-header {
		padding: 15px 15px 0 15px;
	}
}
</style>

