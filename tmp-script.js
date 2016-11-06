const css = require('css');
const fs = require('fs');

const source = fs.readFileSync('./dist/assets/fonts.css', 'utf-8');
const parsed = css.parse(source, {
        source: './dist/assets/fonts.css'
      });
      parsed.stylesheet.rules
        .filter(r => r.type === 'font-face')
        .forEach(r => {
          // console.log('r', r);
          r.declarations
          .filter(d => d.property === 'src')
          .forEach(d => {
            // console.log('src', d.value);
            if (Array.isArray(d.value)) {
              // console.log('an array', d.property);
              d.value.forEach((v, i) => {
                if (/^url\(/.test(v)) {
                  const fontPath = path.relative(process.cwd(), path.resolve(p, new RegExp('^url\((.*)').exec(v)));
                  // console.log('fontPath', fontPath);
                  // const fontContents = new Buffer(compilation.assets[fontPath]).toString('base64')
                  const fontContents = fs.readFileSync(fontPath, 'base64');
                  // console.log('fontContents', fontContents);
                  d.value[i] = `url(data:application/font-woff;base64,${fontContents}`
                }
              })
            } else {
              // console.log('not an array', d.property);
              // console.log(d.value)
              replaceUrlWithSource(d.value.split(',')[0])
            }
          })
        })

        function replaceUrlWithSource(url) {
          console.log('url', url);
          const pathFormatExp = /url\((.*)\) format\((.*)\)/;
          if (pathFormatExp.test(url)) {
            const [foo, path, format] = /url\((.*)\) format\((.*)\)/.exec(url);
            console.log('path, format', path, format);
            return `url(data:application/font-${format})`
          } else {

          }


        }