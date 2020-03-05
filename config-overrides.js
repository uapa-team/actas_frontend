const { override, fixBabelImports, addLessLoader } = require("customize-cra");
module.exports = override(
  fixBabelImports("import", {
    libraryName: "antd",
    libraryDirectory: "es",
    style: true
  }),
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: {
      "@primary-color": "#2d2656",
      "@link-color": "#2d2656",
      //   "@success-color": "#2d2656",
      //   "@warning-color": "#2d2656",
      //   "@error-color": "#2d2656",
      //   "@font-size-base": "14px",
      //   "@heading-color": "rgba(0, 0, 0, 0.85)",
      //   "@text-color": "rgba(0, 0, 0, 0.65)",
      //   "@text-color-secondary": "rgba(0, 0, 0, 0.45)",
      //   "@disabled-color": "rgba(0, 0, 0, 0.25)",
      //   "@border-radius-base": "4px",
      "@border-color-base": "#2d2656",
      "@box-shadow-base": "0 0 0 1px rgba(18,15,34,0.2)"
    }
  })
);
