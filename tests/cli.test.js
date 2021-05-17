const { Docium } = require('../src/docium');
const { expect } = require('chai');

describe('Cli test', () => {
	describe('Set dist folder', () => {
		it('should resolve it by CWD', () => {
			const app = new Docium({
				_: ['', './dist']
			});

			expect(app.distPath).eq(process.cwd() + '/dist');
		});

		describe('Set absolute folder', () => {
			it('should set it', () => {
				const app = new Docium({
					_: ['', process.cwd() + '/dst']
				});

				expect(app.distPath).eq(process.cwd() + '/dst');
			});
		});
	});
});
