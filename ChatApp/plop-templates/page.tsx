import * as React from "react";
import Helmet from "react-helmet";
import "./{{ properCase name}}.scss";

export interface {{ properCase name }}Props {}
export interface {{ properCase name }}State {}

class {{ properCase name }} extends React.Component<{{ properCase name }}Props, {{ properCase name }}State> {
  render() {
    return (
      <div className="{{ dashCase name }}">
        <Helmet>
          <link rel="canonical" href="https://sik.ayy.fi/INSERT_PATH_HERE!" />
        </Helmet>
        {{ titleCase name }}
      </div>
    );
  }
}

export default {{ properCase name }};
