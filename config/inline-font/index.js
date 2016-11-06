const fs = require('fs');
const rimraf = require('rimraf');
const path = require('path');
const mkdirp = require('mkdirp');
const critical = require('critical');
const css = require('css');

function InlineFontPlugin(options) {
  // this.options = Object.assign({}, {
  //   base: '',
  //   inline: true,
  //   minify: true,
  //   extract: true,
  //   timeout: 30000
  // }, options);
}

InlineFontPlugin.prototype.apply = function(compiler) {
  options = this.options;

  compiler.plugin("emit", function(compilation, callback) {
    const cssFiles = Object.keys(compilation.assets)
      .filter(p => /\.css$/.test(p));

    cssFiles.forEach(p => {
      const source = compilation.assets[p].source().toString();
      console.log('source', source);
      const parsed = css.parse(source, {
        source: p
      });
      parsed.stylesheet.rules
        .filter(r => r.type === 'font-face')
        .forEach(r => {
          console.log('r', r);
          r.declarations
          .filter(d => d.property === 'src')
          .forEach(d => {
            console.log('src', d.value);
            if (Array.isArray(d.value)) {
              d.value.forEach((v, i) => {
                if (/^url\(/.test(v)) {
                  const fontPath = path.relative(process.cwd(), path.resolve(p, new RegExp('^url\((.*)').exec(v)));
                  console.log('fontPath', fontPath);
                  const fontContents = new Buffer(compilation.assets[fontPath]).toString('base64')
                  console.log('fontContents');
                  d.value[i] = `url(data:application/font-woff;base64,${fontContents}`
                }
              })
            } else {
              console.log('not an array', d);
            }
          })
        })
      const stringified = css.stringify(parsed);
      compilation.assets[p] = { source: () => stringified, size: () => stringified.length };
      callback();
    });

    // TODO: Make all sync operations async
  //   const tmp = fs.mkdtempSync('criticalcss');
  //   Object.keys(compilation.assets)
  //     .filter((p) => /\.(?:css|html)$/.test(p))
  //     .forEach((p) => {
  //       const tmpPath = path.resolve(tmp, p);
  //       mkdirp.sync(path.resolve(tmpPath, '../'))
  //       fs.writeFileSync(tmpPath, compilation.assets[p].source().toString(), 'utf-8');
  //     })

  //   const opts = Object.assign({}, options, {
  //     base: path.resolve(tmp, options.base)
  //   });
  //   critical.generate(opts, (err, output) => {
  //     // TODO: Make recursive and start at root of tmp
  //     fs.readdirSync(path.resolve(tmp, 'assets'))
  //       .forEach((p) => {
  //         const src = fs.readFileSync(path.resolve(tmp, 'assets', p), 'utf-8');
  //         compilation.assets[`assets/${p}`] = {source: () => src, size: () => src.length};
  //       });
  //     compilation.assets[opts.src] = {source: () => output, size: () => output.length};
  //     rimraf.sync(tmp);
  //     callback(err);
  //   });
  });
};

module.exports = InlineFontPlugin;
