import { defineConfig } from 'vite'
import path, { resolve } from 'path';

export default defineConfig({
	base: '',
	build: {
    outDir: './build',
		rollupOptions: {
      input: {
        main: resolve(__dirname, '/index.html'),
      },
      output: {
        assetFileNames: (assetInfo) => {
          let extType = (assetInfo.name.match(/\.([a-z0-9]+)$/i) || [])[1];
          if (/(css)/i.test(extType)) {
            return `resources/${extType}/[name]-[hash][extname]`;
          } else if (/(png|jpe?g|svg|gif|tiff|bmp|ico)/i.test(extType)) {
            extType = 'images';
          } else if (/(woff2|woff2|otf|ttf)/i.test(extType)) {
            extType = 'fonts';
          }
          return `resources/${extType}/[name][extname]`; // remove hash
        },
        chunkFileNames: 'resources/js/[name]-[hash].js',
        entryFileNames: 'resources/js/[name]-[hash].js'
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