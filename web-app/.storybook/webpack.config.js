module.exports = ({ config }) => {
  const rules = config.module.rules;

  // Find the rule handling .jsx
  const javaScriptRuleIndex = rules.findIndex(rule => rule.test.test(".jsx"));

  const javaScriptRules = rules[javaScriptRuleIndex];
  const javaScriptRulePresets = javaScriptRules.use[0].options.presets;

  // Find the react preset
  const reactPresetIndex = javaScriptRulePresets.findIndex(preset => {
    if (typeof preset !== "string") return false;
    return preset.match("preset-react");
  });

  // Remove the react preset
  javaScriptRulePresets.splice(reactPresetIndex, reactPresetIndex);

  return config;
};
