const { override, fixBabelImports, addLessLoader } = require("customize-cra");
module.exports = override(
  fixBabelImports("import", {
    libraryName: "antd",
    libraryDirectory: "es",
    style: true,
  }),
  addLessLoader({
    lessOptions: {
      javascriptEnabled: true,
      modifyVars: {
        "@primary-color": "#2d2656",
        "@link-color": "#2d2656",
        "@border-radius-base": "4px",
        "@border-color-base": "#2d2656",
        "@box-shadow-base": "0 0 0 1px rgba(18,15,34,0.2)",
        /*Tabs styling */
        "@tabs-card-tab-active-border-top": "2px solid #2d2656",
        "@tabs-highlight-color": "white",
      },
    },
  })
);
