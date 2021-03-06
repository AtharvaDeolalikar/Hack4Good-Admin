import { lazy } from "react";
import { IFieldConfig, FieldType } from "components/fields/types";
import withHeavyCell from "../_withTableCell/withHeavyCell";

import RichTextIcon from "@mui/icons-material/TextFormat";
import BasicCell from "../_BasicCell/BasicCellNull";
import withSideDrawerEditor from "components/Table/editors/withSideDrawerEditor";

const TableCell = lazy(
  () => import("./TableCell" /* webpackChunkName: "TableCell-RichText" */)
);
const SideDrawerField = lazy(
  () =>
    import(
      "./SideDrawerField" /* webpackChunkName: "SideDrawerField-RichText" */
    )
);

export const config: IFieldConfig = {
  type: FieldType.richText,
  name: "Rich Text",
  group: "Text",
  dataType: "string",
  initialValue: "",
  initializable: true,
  icon: <RichTextIcon />,
  description: "HTML edited with a rich text editor.",
  TableCell: withHeavyCell(BasicCell, TableCell),
  TableEditor: withSideDrawerEditor(TableCell),
  SideDrawerField,
};
export default config;
