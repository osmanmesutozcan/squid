export default {
  port: 3001,
  title: "Docs Squid",
  typescript: true,
  wrapper: "src/lib/wrapper.tsx",
  themeConfig: {
    mode: "dark"
  },
  modifyBundlerConfig: config => {
    config.resolve.extensions.push(".css");
    config.module.rules.push({
      test: /\.css$/,
      use: ["style-loader", "css-loader"]
    });

    return config;
  }
};
