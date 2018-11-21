import * as React from "react";
{{#if observer}}
import { observer } from "mobx-react";
import {{ camelCase store_name }} from "../../stores/{{ properCase store_name }}";
{{/if}}
import "./{{ properCase name}}.scss";

export interface {{ properCase name }}Props {}
export interface {{ properCase name }}State {}

{{#if observer}}@observer {{/if}}class {{ properCase name }} extends React.Component<{{ properCase name }}Props, {{ properCase name }}State> {
  render() {
    return (
      <div className="{{ dashCase name }}">
        {{ titleCase name }}
      </div>
    );
  }
}

{{#if observer}}
export default (props) => <{{ properCase name }} {{ camelCase store_name }}={ {{ camelCase store_name }} } { ...props } />;
{{else}}
export default {{ properCase name }};
{{/if}}