const babelConfig = {
  presets: [
    "next/babel",
    [
      "@babel/preset-react",
      {
        runtime: "automatic",
      },
    ],
  ],
};

export default babelConfig;
