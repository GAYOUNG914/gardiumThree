import { defineConfig } from 'vite'

export default defineConfig({
	base: '',
	build: {
		rollupOptions: {
			// * 여러 index를 갖고, src 는 공유하고 싶을때. like 직방
			input: {
        aa: resolve(__dirname, 'src/aa/index.html'),
        bb: resolve(__dirname, 'src/bb/index.html'),
        cc: resolve(__dirname, 'src/cc/index.html'),
      },
			output: {
				// * assets 파일 이름 설정 - 미디어 파일 및 css 용
				assetFileNames: (assetInfo) => {
					let extType = assetInfo.name.match(/\.([a-z0-9]+)$/i)[1];
					if (/(css)/i.test(extType)) {
						return `resources/${extType}/[name]-[hash][extname]`;
					} else if (/(png|jpe?g|svg|gif|tiff|bmp|ico)/i.test(extType)) {
						extType = 'images';
					} else if (/(woff2|woff2|otf|ttf)/i.test(extType)) {
						extType = 'fonts';
					}
					return `resources/${extType}/[name][extname]`; // remove hash
				},
				chunkFileNames: 'resources/js/[name]-[hash].js', // 청크 파일 이름 구성
				entryFileNames: 'resources/js/[name]-[hash].js'  // 파일 이름 구성
			}
		},

		// * console 과 debug 제거
		terserOptions: { 
      compress: {
        drop_console: true, // console 제거
        drop_debugger: true, // debug 제거
      },
    },
	}
});