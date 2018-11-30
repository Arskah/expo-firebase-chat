import * as React from "react";
import { View, Text, StyleSheet } from "react-native";
import Colors from "../constants/Colors";
import Layout from "../constants/Layout";
{{#if observer}}
import { observer } from "mobx-react";
import {{ camelCase store_name }} from "../../stores/{{ properCase store_name }}";
{{/if}}

export interface {{ properCase name }}Props {}
export interface {{ properCase name }}State {}

{{#if observer}}@observer {{/if}}class {{ properCase name }} extends React.Component<{{ properCase name }}Props, {{ properCase name }}State> {
  render() {
    return (
      <Text style={styles.{{ camelCase name }} }>
        {{ titleCase name }}
      </Text>
    );
  }
}

const DEVICE_WIDTH = Layout.window.width;
const DEVICE_HEIGHT = Layout.window.height;

const styles = StyleSheet.create({
  {{ camelCase name }}: {
  },
});

{{#if observer}}
export default (props) => <{{ properCase name }} {{ camelCase store_name }}={ {{ camelCase store_name }} } { ...props } />;
{{else}}
export default {{ properCase name }};
{{/if}}