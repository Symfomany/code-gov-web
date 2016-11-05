const fs = require('fs');
const rimraf = require('rimraf');
const path = require('path');
const mkdirp = require('mkdirp');
const critical = require('critical');

function CriticalCssPlugin(options) {
  // Configure your plugin with options...

  this.options = Object.assign({}, {
        // Inline the generated critical-path CSS
        // - true generates HTML
        // - false generates CSS
        inline: true,

        // Minify critical-path CSS when inlining
        minify: true,

        // Extract inlined styles from referenced stylesheets
        extract: true,

        // Complete Timeout for Operation
        timeout: 30000,

        // Prefix for asset directory
        // pathPrefix: '',
        ignore: ['font-face']
    }, options);
}

CriticalCssPlugin.prototype.apply = function(compiler) {
  options = this.options;

  compiler.plugin("emit", function(compilation, callback) {
    const tmp = fs.mkdtempSync('criticalcss');
    console.log('tmp', tmp);
    console.log("The compilation is going to emit files...", compilation.assets['index.html'].source());
    Object.keys(compilation.assets)
      .filter((p) => /\.css$/.test(p))
      .forEach((p) => {
        console.log('path', p);
        const tmpPath = path.resolve(tmp, p);

        console.log('tmpPath', tmpPath);
        mkdirp.sync(path.resolve(tmpPath, '../'))
        console.log('source', compilation.assets[p].source().toString())
        fs.writeFileSync(tmpPath, compilation.assets[p].source().toString(), 'utf-8');
      })

    const opts = Object.assign({}, options, {
      html: compilation.assets['index.html'].source(),
      base: path.resolve(tmp),
      // pathPrefix: tmp
    });
    console.log('opts', opts);
    critical.generate(opts, (err, output) => {
      console.log('err', err);
      console.log('output', output);
      // TODO: Make recursive
      fs.readdirSync(path.resolve(tmp, 'assets')).forEach((p) => {
        const src = fs.readFileSync(path.resolve(tmp, 'assets', p), 'utf-8');
        console.log('p, src:', p, src);
        compilation.assets[`assets/${p}`] = {source: () => src, size: () => src.length};
      });
      compilation.assets['index.html'] = {source: () => output, size: () => output.length};
      // rimraf.sync(tmp);
      callback(err);
    });
  });
};

module.exports = CriticalCssPlugin;
