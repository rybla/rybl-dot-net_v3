import * as mdast from "mdast";

export interface Node extends mdast.Node {
  annotation?: object;
}

export interface Parent extends Node {
  children: mdast.RootContent[];
}

export interface Root extends Parent {
  type: "root";
  data?: mdast.RootData;
}
