const { build } = require('esbuild');
const { rm, cp, mkdir } = require('node:fs/promises');
const { join } = require('node:path');

const ENTRY_POINTS = [
	'credentials/ZaiApi.credentials.ts',
	'nodes/ZaiChat/ZaiChat.node.ts',
	'nodes/ZaiImage/ZaiImage.node.ts',
];

const EXTERNAL = ['n8n-workflow'];

async function main() {
	// Clean dist
	await rm('dist', { recursive: true, force: true });
	await mkdir('dist', { recursive: true });

	// Bundle with esbuild
	await build({
		entryPoints: ENTRY_POINTS,
		bundle: true,
		platform: 'node',
		target: 'es2019',
		format: 'cjs',
		outdir: 'dist',
		external: EXTERNAL,
		sourcemap: true,
	});

	// Copy static assets
	await cp('icons', join('dist', 'icons'), { recursive: true });

	console.log('Build complete');
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
