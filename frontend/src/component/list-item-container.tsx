import React from "react";
import styled from "@emotion/styled";

import { unit, glass } from "../styles";

export default function ListItemContainer(props: any) {
  return <Container>{props.children}</Container>;
}

const Container = styled("section")({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  maxWidth: "22.5rem",
  margin: `0 auto`,
  marginBottom: unit * 1.2,
  background: glass.glassBg,
  boxShadow: glass.glassShadow,
  backdropFilter: glass.backdropFilter,
  WebkitBackdropFilter: glass.backdropFilter,
  borderRadius: unit * 1,
  border: glass.border,
  padding: unit * 1.5,
  paddingBottom: unit * 1,
  cursor: "pointer",
  "& h3, .tel": {
    textAlign: "center",
  },
  "& .type": {
    fontWeight: "bold",
  },
  "& .to-detail": {
    textAlign: "right",
    fontSize: "0.9rem",
  },
});
