export const process = (src, filename, config, options) => {
    if (filename.match(/\.(mp4|png|jpg)$/)) {
      return `module.exports = '${filename}';`;
    }
    return src;
  };