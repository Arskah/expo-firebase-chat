module.exports = function(plop) {
  plop.setGenerator("New component", {
    description: "Create a new TSX + SCSS component for React.",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "Component name:"
      },
      {
        type: "list",
        choices: [{ name: "No, it does not observe a store", value: false }, { name: "Yes, it observes a store", value: true }],
        name: "observer",
        message: "Is the component a MobX observer?"
      },
      {
        type: "input",
        name: "store_name",
        message: "MobX store name:",
        when: answers => answers.observer
      },
    ],
    actions: [
      {
        type: "add",
        path: "src/components/{{ properCase name }}.tsx",
        templateFile: "plop-templates/component.tsx",
        abortOnFail: true
      },
      // {
      //   type: "add",
      //   path: "src/components/{{ properCase name }}/{{ properCase name }}.scss",
      //   templateFile: "plop-templates/component.scss",
      //   abortOnFail: true
      // },
      // {
      //   type: "add",
      //   path: "src/components/{{ properCase name }}/index.ts",
      //   templateFile: "plop-templates/index.ts",
      //   abortOnFail: true
      // }
    ]
  });
  plop.setGenerator("New page", {
    description: "Create a new TSX + SCSS page for React.",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "Page name (has to end in \"page\"):"
      },
    ],
    actions: [
      {
        type: "add",
        path: "src/pages/{{ properCase name }}/{{ properCase name }}.tsx",
        templateFile: "plop-templates/page.tsx",
        abortOnFail: true
      },
      {
        type: "add",
        path: "src/pages/{{ properCase name }}/{{ properCase name }}.scss",
        templateFile: "plop-templates/page.scss",
        abortOnFail: true
      },
      {
        type: "add",
        path: "src/pages/{{ properCase name }}/index.ts",
        templateFile: "plop-templates/index.ts",
        abortOnFail: true
      }
    ]
  });
  plop.setGenerator("New MobX state store", {
    description: "Create a new store for MobX.",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "Store name:"
      }
    ],
    actions: [
      {
        type: "add",
        path: "src/stores/{{ properCase name }}.ts",
        templateFile: "plop-templates/store.ts",
        abortOnFail: true
      }
    ]
  });
  plop.setGenerator("New API model", {
    description: "Create a new API model for backend communication.",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "Model name:"
      }
    ],
    actions: [
      {
        type: "add",
        path: "src/models/{{ properCase name }}.ts",
        templateFile: "plop-templates/model.ts",
        abortOnFail: true
      }
    ]
  });
};
