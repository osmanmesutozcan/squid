import React from "react";
import { Link } from "react-router-dom";

/**
 * Home page component.
 */
export default class Home extends React.Component {
  render() {
    return <Link to="/app">Launch</Link>;
  }
}
